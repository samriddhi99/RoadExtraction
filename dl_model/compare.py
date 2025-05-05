import numpy as np
import cv2
import matplotlib.pyplot as plt
from og import load_model_weights
import os
import math

def split_image_into_tiles(image, tile_size=512, overlap=3):
    """
    Split a large image into tiles with optional overlap.
    
    Args:
        image: Input large image
        tile_size: Size of each tile
        overlap: Overlap between adjacent tiles to avoid edge artifacts
        
    Returns:
        List of tiles and their positions (tile, x, y)
    """
    height, width = image.shape[:2]
    tiles = []
    
    effective_tile_size = tile_size - overlap
    
    num_tiles_x = math.ceil(width / effective_tile_size)
    num_tiles_y = math.ceil(height / effective_tile_size)
    
    for y in range(num_tiles_y):
        for x in range(num_tiles_x):
            x_start = x * effective_tile_size
            y_start = y * effective_tile_size
            
            x_end = min(x_start + tile_size, width)
            y_end = min(y_start + tile_size, height)
            
            x_start = max(0, x_end - tile_size)
            y_start = max(0, y_end - tile_size)
            
            tile = image[y_start:y_end, x_start:x_end]
            
            tiles.append((tile, x_start, y_start))
    
    return tiles

def predict_tile_road_mask(model, tile):
    """
    Predict road mask for a single image tile.
    """
    tile_rgb = tile.copy() if len(tile.shape) == 3 else cv2.cvtColor(tile, cv2.COLOR_GRAY2RGB)
    resized_tile = cv2.resize(tile_rgb, (256, 256))
    normalized_tile = resized_tile / 255.0
    
    input_tile = np.expand_dims(normalized_tile, axis=0)
    
    predicted_mask = model.predict(input_tile)
    predicted_mask = (predicted_mask > 0.5).astype(np.uint8)[0]
    
    if resized_tile.shape[:2] != tile.shape[:2]:
        predicted_mask = cv2.resize(predicted_mask, (tile.shape[1], tile.shape[0]))
    
    return predicted_mask

def process_large_image(model, image_path, tile_size = 512 , overlap=32):
    """
    Process large image by splitting it into tiles, running predictions, and stitching results.
    """
    original_image = cv2.imread(image_path)
    original_image = cv2.cvtColor(original_image, cv2.COLOR_BGR2RGB)
    
    height, width = original_image.shape[:2]
    
    full_mask = np.zeros((height, width, 1), dtype=np.uint8)
    
    tiles = split_image_into_tiles(original_image, tile_size, overlap)
    
    print(f"Processing {len(tiles)} tiles for image {os.path.basename(image_path)}...")
    
    for i, (tile, x_start, y_start) in enumerate(tiles):
        if i % 10 == 0:
            print(f"Processing tile {i+1}/{len(tiles)}")
        
        mask = predict_tile_road_mask(model, tile)
        
        if len(mask.shape) == 2:
            mask = np.expand_dims(mask, axis=-1)
        
        x_end = min(x_start + tile.shape[1], width)
        y_end = min(y_start + tile.shape[0], height)
        
        mask_region = full_mask[y_start:y_end, x_start:x_end]
        
        full_mask[y_start:y_end, x_start:x_end] = np.maximum(mask_region, mask[:y_end-y_start, :x_end-x_start])
    
    yellow_mask = np.zeros_like(original_image)
    yellow_mask[full_mask[:,:,0] == 1] = [255, 255, 0]
    
    overlay_image = cv2.addWeighted(original_image, 0.7, yellow_mask, 0.3, 0)
    
    return original_image, full_mask, overlay_image

def detect_road_changes(model, image1_path, image2_path, tile_size=256, overlap=32):
    """
    Detects road changes between two large images of the same location at different times.
    """
    print("Processing first image...")
    original1, mask1, overlay1 = process_large_image(model, image1_path, tile_size, overlap)
    
    print("Processing second image...")
    original2, mask2, overlay2 = process_large_image(model, image2_path, tile_size, overlap)
    
    if original1.shape != original2.shape:
        min_height = min(original1.shape[0], original2.shape[0])
        min_width = min(original1.shape[1], original2.shape[1])
        
        original1 = cv2.resize(original1, (min_width, min_height))
        original2 = cv2.resize(original2, (min_width, min_height))
        mask1 = cv2.resize(mask1, (min_width, min_height))
        mask2 = cv2.resize(mask2, (min_width, min_height))
    
    binary_mask1 = mask1[:,:,0].astype(np.bool_)
    binary_mask2 = mask2[:,:,0].astype(np.bool_)
    
    old_roads = binary_mask1
    
    new_roads = np.logical_and(binary_mask2, np.logical_not(binary_mask1))
    
    composite_image = cv2.addWeighted(original1, 0.5, original2, 0.5, 0)
    
    change_mask = np.zeros_like(composite_image)
    
    change_mask[old_roads] = [255, 0, 0]
    
    change_mask[new_roads] = [0, 0, 255]
    
    change_overlay = cv2.addWeighted(composite_image, 0.7, change_mask, 0.3, 0)
    
    return composite_image, old_roads, new_roads, change_overlay

def visualize_road_changes(composite_image, old_roads, new_roads, change_overlay):
    """
    Visualize the road changes between two time periods.
    """
    plt.figure(figsize=(15, 10))
    
    plt.subplot(2, 2, 1)
    plt.title('Composite Image')
    plt.imshow(composite_image)
    plt.axis('off')
    
    plt.subplot(2, 2, 2)
    plt.title('Existing Roads')
    plt.imshow(old_roads, cmap='gray')
    plt.axis('off')
    
    plt.subplot(2, 2, 3)
    plt.title('Newly Constructed Roads')
    plt.imshow(new_roads, cmap='gray')
    plt.axis('off')
    
    plt.subplot(2, 2, 4)
    plt.title('Road Changes Overlay\nRed: Existing Roads, Blue: New Roads')
    plt.imshow(change_overlay)
    plt.axis('off')
    
    plt.tight_layout()
    plt.show()

def save_results(composite_image, old_roads, new_roads, change_overlay, output_dir='.'):
    """
    Save the generated images to disk.
    """
    os.makedirs(output_dir, exist_ok=True)
    
    cv2.imwrite(os.path.join(output_dir, 'composite_image.jpg'), 
                cv2.cvtColor(composite_image, cv2.COLOR_RGB2BGR))
    
    cv2.imwrite(os.path.join(output_dir, 'old_roads.jpg'), 
                old_roads.astype(np.uint8) * 255)
    
    cv2.imwrite(os.path.join(output_dir, 'new_roads.jpg'), 
                new_roads.astype(np.uint8) * 255)
    
    cv2.imwrite(os.path.join(output_dir, 'road_changes_overlay.jpg'), 
                cv2.cvtColor(change_overlay, cv2.COLOR_RGB2BGR))

def main():
    MODEL_PATH = 'models/save_best.h5'
    IMAGE1_PATH = '/home/peddu/final/RoadExtraction/dl_model/images/2022.jpg'
    IMAGE2_PATH = '/home/peddu/final/RoadExtraction/dl_model/images/2025.jpg'
    
    TILE_SIZE = 1024
    OVERLAP = 3
    
    print("Loading model...")
    model = load_model_weights(MODEL_PATH)
    
    print("Detecting road changes...")
    composite_image, old_roads, new_roads, change_overlay = detect_road_changes(
        model, IMAGE1_PATH, IMAGE2_PATH, TILE_SIZE, OVERLAP
    )
    
    print("Visualizing results...")
    visualize_road_changes(composite_image, old_roads, new_roads, change_overlay)
    
    print("Saving results...")
    save_results(composite_image, old_roads, new_roads, change_overlay, 'results')
    
    print("Road change detection completed. Results saved to 'results' folder.")

if __name__ == "__main__":
    main()