import numpy as np
import cv2
import matplotlib.pyplot as plt
from og import load_model_weights
import os
import math

def connect_roads_with_thinning(road_mask, max_gap=20):
    """
    Connect road segments by thinning to skeletons and extending endpoints
    
    Args:
        road_mask: Binary road mask
        max_gap: Maximum gap to bridge between endpoints
        
    Returns:
        Connected road mask
    """
    # Convert to uint8
    mask = road_mask.astype(np.uint8) * 255
    
    # Skeletonize the road mask (thinning)
    skeleton = cv2.ximgproc.thinning(mask)
    
    # Find endpoints of the skeleton lines
    kernel = np.array([[1, 1, 1],
                       [1, 10, 1],
                       [1, 1, 1]], dtype=np.uint8)
    
    convolved = cv2.filter2D(skeleton.astype(np.uint8), -1, kernel)
    endpoints = np.logical_and(convolved == 11, skeleton > 0)
    
    # Get coordinates of endpoints
    endpoint_coords = np.column_stack(np.where(endpoints))
    
    # Create a new image for the connections
    connections = np.zeros_like(skeleton)
    
    # For each endpoint, find the nearest other endpoint within max_gap
    for i, (y1, x1) in enumerate(endpoint_coords):
        min_dist = max_gap + 1
        nearest = None
        
        for j, (y2, x2) in enumerate(endpoint_coords):
            if i != j:  # Don't connect to self
                dist = np.sqrt((y2-y1)**2 + (x2-x1)**2)
                if dist < min_dist and dist <= max_gap:
                    min_dist = dist
                    nearest = (y2, x2)
        
        # If found a nearby endpoint, draw a line to connect them
        if nearest:
            y2, x2 = nearest
            cv2.line(connections, (x1, y1), (x2, y2), 255, 1)
    
    # Combine original skeleton with new connections
    result = cv2.bitwise_or(skeleton, connections)
    
    # Dilate the result to get back to road width
    # Adjust the dilation kernel size and iterations based on original road width
    kernel_size = 3  # Adjust based on road width
    result = cv2.dilate(result, np.ones((kernel_size, kernel_size), np.uint8), iterations=2)
    
    return result > 0


def visualize_road_connection(original_mask, connected_mask, title="Road Connection Comparison", save_path=None):
    """
    Visualize the difference between original and connected masks
    """
    plt.figure(figsize=(15, 5))
    
    plt.subplot(1, 3, 1)
    plt.title('Original Road Mask')
    plt.imshow(original_mask, cmap='gray')
    plt.axis('off')
    
    plt.subplot(1, 3, 2)
    plt.title('Connected Road Mask')
    plt.imshow(connected_mask, cmap='gray')
    plt.axis('off')
    
    # Show the new connections in color
    diff = np.zeros((original_mask.shape[0], original_mask.shape[1], 3), dtype=np.uint8)
    diff[original_mask] = [0, 255, 0]  # Original in green
    diff[np.logical_and(connected_mask, np.logical_not(original_mask))] = [255, 0, 0]  # New connections in red
    
    plt.subplot(1, 3, 3)
    plt.title('New Connections (red)')
    plt.imshow(diff)
    plt.axis('off')
    
    plt.suptitle(title, fontsize=16)
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path)
        print(f"Visualization saved to {save_path}")
    
    plt.show()
    



def analyze_new_road_length(new_roads, scale_meters_per_pixel, min_length_meters=10, save_visualization=True):
    """
    Calculate and print the amount of new roads detected when given the scale of the images.
    Roads shorter than the given threshold are not considered.
    
    Args:
        new_roads: Binary mask of newly constructed roads
        scale_meters_per_pixel: Scale factor to convert pixel distances to meters
        min_length_meters: Minimum road segment length to consider (in meters)
        save_visualization: Whether to save a visualization of the analysis
        
    Returns:
        tuple: (total_length_meters, valid_segments, filtered_segments)
    """
    # Convert binary mask to 8-bit for OpenCV
    binary_mask = new_roads.astype(np.uint8) * 255
    
    # Connected component analysis to identify separate road segments
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(binary_mask, connectivity=8)
    
    total_length_meters = 0
    valid_segments = 0
    filtered_segments = 0
    
    # Create visualization
    viz_image = np.zeros((binary_mask.shape[0], binary_mask.shape[1], 3), dtype=np.uint8)
    
    # Skip label 0 (background)
    for label in range(1, num_labels):
        # Get segment pixels
        segment_mask = (labels == label)
        
        # Get bounding box and area stats
        x, y, w, h = stats[label, cv2.CC_STAT_LEFT], stats[label, cv2.CC_STAT_TOP], \
                     stats[label, cv2.CC_STAT_WIDTH], stats[label, cv2.CC_STAT_HEIGHT]
        area_pixels = stats[label, cv2.CC_STAT_AREA]
        
        # Estimate length - for road-like structures, use max dimension as approximation
        segment_length_pixels = max(w, h)
        segment_length_meters = segment_length_pixels * scale_meters_per_pixel
        
        # Consider if segment is valid based on length threshold
        if segment_length_meters >= min_length_meters:
            total_length_meters += segment_length_meters
            valid_segments += 1
            # Draw valid segments in green
            viz_image[segment_mask] = [0, 255, 0]
        else:
            filtered_segments += 1
            # Draw filtered segments in red
            viz_image[segment_mask] = [0, 0, 255]
    
    print("\nNew Road Construction Analysis:")
    print(f"----------------------------------------")
    print(f"Total new road length: {total_length_meters:.2f} meters")
    print(f"Valid road segments: {valid_segments} (longer than {min_length_meters}m)")
    print(f"Filtered short segments: {filtered_segments}")
    print(f"Scale used: {scale_meters_per_pixel:.4f} meters per pixel")
    print(f"----------------------------------------")
    
    if save_visualization:
        # Overlay the road analysis on the original binary mask
        overlay = np.zeros((binary_mask.shape[0], binary_mask.shape[1], 3), dtype=np.uint8)
        overlay[new_roads] = [100, 100, 100]  # Gray background for all roads
        overlay = cv2.addWeighted(overlay, 0.5, viz_image, 1.0, 0)
        
        # Save visualization
        cv2.imwrite('road_length_analysis.jpg', overlay)
    
    return total_length_meters, valid_segments, filtered_segments

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
    OVERLAP = 32
    
    SCALE_METERS_PER_PIXEL = 0.3 
    MIN_ROAD_LENGTH = 10 
    
    print("Loading model...")
    model = load_model_weights(MODEL_PATH)
    
    print("Detecting road changes...")
    composite_image, old_roads, new_roads, change_overlay = detect_road_changes(
        model, IMAGE1_PATH, IMAGE2_PATH, TILE_SIZE, OVERLAP
    )
    
    # Analyze new road construction
    print("Analyzing new road construction...")
    total_length, valid_segments, filtered_segments = analyze_new_road_length(
        new_roads, 
        SCALE_METERS_PER_PIXEL, 
        MIN_ROAD_LENGTH,
        save_visualization=True
    )
    
    print("Visualizing results...")
    visualize_road_changes(composite_image, old_roads, new_roads, change_overlay)
    
    print("Saving results...")
    save_results(composite_image, old_roads, new_roads, change_overlay, 'results')
    
    # Print summary
    print("\nSummary of Road Change Analysis:")
    print(f"Total new road length: {total_length:.2f} meters")
    print(f"Valid road segments: {valid_segments}")
    print(f"Filtered short segments: {filtered_segments}")
    
    print("Road change detection completed. Results saved to 'results' folder.")

if __name__ == "__main__":
    main()