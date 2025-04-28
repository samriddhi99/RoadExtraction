import numpy as np
import cv2
import matplotlib.pyplot as plt
from og import load_model_weights
import os
import math

def split_image_into_tiles(image, tile_size=256, overlap=3):
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

def process_large_image(model, image_path, tile_size=256, overlap=32):
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

def visualize_road_detection(original_image, road_mask, overlay_image):
    """
    Visualize the results of road detection.
    
    Args:
        original_image: The original input image
        road_mask: Binary mask of detected roads
        overlay_image: Original image with road overlay
    """
    plt.figure(figsize=(15, 10))
    
    plt.subplot(1, 3, 1)
    plt.title('Original Image')
    plt.imshow(original_image)
    plt.axis('off')
    
    plt.subplot(1, 3, 2)
    plt.title('Road Mask')
    plt.imshow(road_mask[:,:,0], cmap='gray')
    plt.axis('off')
    
    plt.subplot(1, 3, 3)
    plt.title('Roads Overlay (Yellow)')
    plt.imshow(overlay_image)
    plt.axis('off')
    
    plt.tight_layout()
    plt.show()

def save_road_detection_results(original_image, road_mask, overlay_image, output_dir='results'):
    """
    Save the road detection results to disk.
    
    Args:
        original_image: The original input image
        road_mask: Binary mask of detected roads
        overlay_image: Original image with road overlay
        output_dir: Directory to save results
    """
    os.makedirs(output_dir, exist_ok=True)
    
    cv2.imwrite(os.path.join(output_dir, 'original_image.jpg'), 
                cv2.cvtColor(original_image, cv2.COLOR_RGB2BGR))
    
    cv2.imwrite(os.path.join(output_dir, 'road_mask.jpg'), 
                road_mask * 255)
    
    cv2.imwrite(os.path.join(output_dir, 'roads_overlay.jpg'), 
                cv2.cvtColor(overlay_image, cv2.COLOR_RGB2BGR))
    
    print(f"Results saved to '{output_dir}' directory.")

def process_single_image(model, image_path, output_dir='results', tile_size=256, overlap=32):
    """
    Process a single large image for road detection and save/visualize results.
    
    Args:
        model: The loaded road detection model
        image_path: Path to the input image
        output_dir: Directory to save results
        tile_size: Size of tiles for processing
        overlap: Overlap between tiles
    """
    print(f"Processing image: {os.path.basename(image_path)}")
    
    original_image, road_mask, overlay_image = process_large_image(
        model, image_path, tile_size, overlap
    )
    
    visualize_road_detection(original_image, road_mask, overlay_image)
    
    save_road_detection_results(original_image, road_mask, overlay_image, output_dir)

def main():
    MODEL_PATH = 'models/roads_extraction.h5'
    IMAGE_PATH = '/home/peddu/final/RoadExtraction/dl_model/images/with_roads.jpg'
    
    TILE_SIZE = 512
    OVERLAP = 32
    
    OUTPUT_DIR = 'road_detection_results'
    
    print("Loading model...")
    model = load_model_weights(MODEL_PATH)
    
    process_single_image(model, IMAGE_PATH, OUTPUT_DIR, TILE_SIZE, OVERLAP)
    
    print("Road detection completed.")

if __name__ == "__main__":
    main()