import os
import numpy as np
import cv2
from pathlib import Path

from dl_model.compare import (
    load_model_weights, 
    process_large_image, 
    detect_road_changes
)

def detect_significant_road_changes(image1_path, image2_path, output_dir='dl_model/results', 
                                   tile_size=1024, overlap=3, threshold=15):
    """
    Detect if there is a significant change in roads between two satellite images.
    
    Args:
        image1_path (str): Path to the first satellite image (earlier timepoint)
        image2_path (str): Path to the second satellite image (later timepoint)
        output_dir (str): Directory to save results
        tile_size (int): Size of tiles to process
        overlap (int): Overlap between tiles
        threshold (float): Percentage threshold for considering a change significant (default: 15%)
        
    Returns:
        tuple: (is_significant_change (bool), change_percentage (float), result_path (str))
        
    """
    model_path = 'dl_model/models/save_best.h5'
    os.makedirs(output_dir, exist_ok=True)
    
    model = load_model_weights(model_path)
    
    composite_image, old_roads, new_roads, change_overlay = detect_road_changes(
        model, image1_path, image2_path, tile_size, overlap
    )

    total_pixels = old_roads.size
    old_road_pixels = np.sum(old_roads)
    new_road_pixels = np.sum(new_roads)
    
    if old_road_pixels > 0:
        change_percentage = (new_road_pixels / old_road_pixels) * 100
    else:
        change_percentage = 100 if new_road_pixels > 0 else 0
    
    is_significant_change = change_percentage > threshold
    
    img1_name = Path(image1_path).stem
    img2_name = Path(image2_path).stem
    result_filename = f"{img1_name}_{img2_name}_result.jpg"
    result_path = os.path.join(output_dir, result_filename)
    
    text_overlay = change_overlay.copy()
    text = f"Change: {change_percentage:.2f}% - {'SIGNIFICANT' if is_significant_change else 'NOT SIGNIFICANT'}"
    cv2.putText(text_overlay, text, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
    
    cv2.imwrite(result_path, cv2.cvtColor(text_overlay, cv2.COLOR_RGB2BGR))
    
    return is_significant_change, change_percentage, result_path

"""def main():
    
    image1_path = 'dl_model/images/2022.jpg'
    image2_path = 'dl_model/images/2025.jpg'
    
    is_significant, percentage, result_path = detect_significant_road_changes(
    image1_path, image2_path
    )
    
    print(f"Significant Change Detected: {is_significant}")
if __name__ == "__main__":
    main()"""