import os
import numpy as np
import cv2
from pathlib import Path

from compare import (
    load_model_weights, 
    process_large_image, 
    detect_road_changes
)

def detect_significant_road_changes(model_path, image1_path, image2_path, output_dir='results', 
                                   tile_size=1024, overlap=3, threshold=15):
    """
    Detect if there is a significant change in roads between two satellite images.
    
    Args:
        model_path (str): Path to the saved model weights
        image1_path (str): Path to the first satellite image (earlier timepoint)
        image2_path (str): Path to the second satellite image (later timepoint)
        output_dir (str): Directory to save results
        tile_size (int): Size of tiles to process
        overlap (int): Overlap between tiles
        threshold (float): Percentage threshold for considering a change significant (default: 15%)
        
    Returns:
        tuple: (is_significant_change (bool), change_percentage (float), result_path (str))
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Load model
    print("Loading model...")
    model = load_model_weights(model_path)
    
    # Detect road changes between images
    print(f"Detecting road changes between {os.path.basename(image1_path)} and {os.path.basename(image2_path)}...")
    composite_image, old_roads, new_roads, change_overlay = detect_road_changes(
        model, image1_path, image2_path, tile_size, overlap
    )
    
    # Calculate the percentage of change
    total_pixels = old_roads.size
    old_road_pixels = np.sum(old_roads)
    new_road_pixels = np.sum(new_roads)
    
    # Net change percentage (new roads relative to original roads)
    if old_road_pixels > 0:
        change_percentage = (new_road_pixels / old_road_pixels) * 100
    else:
        # If there were no roads in the first image but there are roads in the second
        change_percentage = 100 if new_road_pixels > 0 else 0
    
    # Determine if change is significant
    is_significant_change = change_percentage > threshold
    
    # Generate result filename from input filenames
    img1_name = Path(image1_path).stem
    img2_name = Path(image2_path).stem
    result_filename = f"{img1_name}_{img2_name}_result.jpg"
    result_path = os.path.join(output_dir, result_filename)
    
    # Add text annotation to the change overlay
    text_overlay = change_overlay.copy()
    text = f"Change: {change_percentage:.2f}% - {'SIGNIFICANT' if is_significant_change else 'NOT SIGNIFICANT'}"
    cv2.putText(text_overlay, text, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
    
    # Save the result
    cv2.imwrite(result_path, cv2.cvtColor(text_overlay, cv2.COLOR_RGB2BGR))
    
    print(f"Analysis complete. Change: {change_percentage:.2f}%")
    print(f"Result saved to: {result_path}")
    
    return is_significant_change, change_percentage, result_path

"""def main():
    MODEL_PATH = 'models/save_best.h5'
    image1_path = 'path/to/your/2022.jpg'
    image2_path = 'path/to/your/2025.jpg'
    
    is_significant, percentage, result_path = detect_significant_road_changes(
        MODEL_PATH, image1_path, image2_path
    )
    
    if is_significant:
        print(f"SIGNIFICANT CHANGE DETECTED: {percentage:.2f}%")
    else:
        print(f"No significant change detected: {percentage:.2f}%")

if __name__ == "__main__":
    main()"""