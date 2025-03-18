import os
import cv2
import numpy as np
import tensorflow as tf
import geopandas as gpd
from skimage.filters import threshold_otsu
from skimage.morphology import skeletonize
from shapely.geometry import LineString, MultiLineString
import matplotlib.pyplot as plt
from tensorflow.keras.models import Model
from tensorflow.keras.layers import (
    Input, Conv2D, MaxPooling2D, concatenate, Conv2DTranspose,
    BatchNormalization, Dropout, Activation
)


project_path = '/dl_model/' 

class UNET:
    """
    U-Net architecture for road extraction from satellite imagery.
    
    This class implements the U-Net architecture with encoder-decoder structure
    and skip connections for effective semantic segmentation of roads.
    """
    
    def _convolve(self, input_, filters):
        """
        Create a convolutional block with two Conv2D layers.
        
        Parameters:
        input_ (tensor): Input tensor
        filters (int): Number of filters for Conv2D layers
        
        Returns:
        tensor: Output tensor after convolution operations
        """
        x = Conv2D(filters=filters, kernel_size=(3, 3), kernel_initializer='he_normal', padding='same')(input_)
        x = BatchNormalization()(x)
        x = Activation('relu')(x)
        
        x = Conv2D(filters=filters, kernel_size=(3, 3), kernel_initializer='he_normal', padding='same')(x)
        x = BatchNormalization()(x)
        x = Activation('relu')(x)
        
        return x
    
    def _convolve_by_upsampling(self, input_, skip_connector, filters, rate):
        """
        Create an up-sampling block with transpose convolution and skip connections.
        
        Parameters:
        input_ (tensor): Input tensor from previous layer
        skip_connector (tensor): Skip connection tensor from encoder path
        filters (int): Number of filters for Conv2D layers
        rate (float): Dropout rate
        
        Returns:
        tensor: Output tensor after up-sampling and convolution operations
        """
        x = Conv2DTranspose(filters=filters, kernel_size=(3, 3), strides=(2, 2), padding='same')(input_)
        x = concatenate([x, skip_connector])
        x = Dropout(rate)(x)
        x = self._convolve(input_=x, filters=filters)
        return x
    
    def unet_main(self, input_, filters=16, rate=0.05):
        """
        Build the complete U-Net architecture with encoder-decoder and skip connections.
        
        Parameters:
        input_ (tensor): Input tensor (image)
        filters (int): Base number of filters, doubles at each encoder level
        rate (float): Dropout rate for regularization
        
        Returns:
        Model: Compiled U-Net model
        """
        # left encoder Path
        c1 = self._convolve(input_=input_, filters=filters)
        p1 = MaxPooling2D(pool_size=(2, 2))(c1)
        p1 = Dropout(rate)(p1)
        
        c2 = self._convolve(input_=p1, filters=filters * 2)
        p2 = MaxPooling2D(pool_size=(2, 2))(c2)
        p2 = Dropout(rate)(p2)
        
        c3 = self._convolve(input_=p2, filters=filters * 4)
        p3 = MaxPooling2D(pool_size=(2, 2))(c3)
        p3 = Dropout(rate)(p3)
        
        c4 = self._convolve(input_=p3, filters=filters * 8)
        p4 = MaxPooling2D(pool_size=(2, 2))(c4)
        p4 = Dropout(rate)(p4)

        # middle bridge
        c5 = self._convolve(input_=p4, filters=filters * 16)
        
        # right decoder path
        c6 = self._convolve_by_upsampling(input_=c5, skip_connector=c4, filters=filters * 8, rate=rate)
        c7 = self._convolve_by_upsampling(input_=c6, skip_connector=c3, filters=filters * 4, rate=rate)
        c8 = self._convolve_by_upsampling(input_=c7, skip_connector=c2, filters=filters * 2, rate=rate)
        c9 = self._convolve_by_upsampling(input_=c8, skip_connector=c1, filters=filters * 1, rate=rate)
        
        output_ = Conv2D(filters=1, kernel_size=(1, 1), activation='sigmoid')(c9)
        
        model = Model(inputs=[input_], outputs=[output_])
        
        return model

def get_unet_model(model_name):
    """
    Load a pre-trained U-Net model.
    
    Parameters:
    model_name (str): Name of the model to load
    
    Returns:
    Model: Loaded U-Net model, or None if loading fails
    """
    u = UNET()
    
    inputs = Input(shape=(256, 256, 3))
    model = u.unet_main(input_=inputs)
    model.compile(optimizer='Adam', loss='binary_crossentropy', metrics=['accuracy'])

    model_path = os.path.join(project_path, f'models/{model_name}.h5')
    if not os.path.isfile(path=model_path):
        print('Model not found:', model_path)
        return None
    else:
        model.load_weights(model_path)
    
    return model

def extract_road_mask(model, image):
    """
    Extract road mask from an image using the provided model.
    
    Parameters:
    model (Model): Trained U-Net model
    image (numpy.ndarray): Input image (256x256x3)
    
    Returns:
    numpy.ndarray: Binary road mask (256x256)
    """
    # Prediction
    predicted_image = model.predict(image[np.newaxis, :, :, :])
    predicted_mask = predicted_image.reshape(image.shape[0], image.shape[1])
    
    # Automatic threshold identification
    pmask_thresh = threshold_otsu(predicted_mask)
    # Binarizing the mask
    _, predicted_mask = cv2.threshold(
        src=predicted_mask, 
        thresh=pmask_thresh, 
        maxval=1, 
        type=cv2.THRESH_BINARY
    )
    
    return predicted_mask

def overlay_road_mask(image, mask, color=(255, 0, 0), alpha=0.5):
    """
    Overlay the road mask on the original image.
    
    Parameters:
    image (numpy.ndarray): The original image
    mask (numpy.ndarray): Binary road mask
    color (tuple): RGB color for the overlay (default: red)
    alpha (float): Transparency of the overlay (0-1)
    
    Returns:
    numpy.ndarray: Image with road mask overlay
    """
    # Make sure image is RGB
    if len(image.shape) == 2:
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
    elif image.shape[2] == 4:  # RGBA
        image = image[:,:,:3]
    
    # Create a copy of the image
    overlay = image.copy()
    
    # Convert mask to 3-channel
    mask_rgb = np.zeros_like(image)
    color_bgr = (color[2], color[1], color[0])  # Convert RGB to BGR for OpenCV
    
    # Set mask pixels to the specified color
    for c in range(3):
        mask_rgb[:, :, c] = mask * color_bgr[c]
    
    # Overlay the mask on the image
    cv2.addWeighted(mask_rgb, alpha, overlay, 1 - alpha, 0, overlay)
    
    return overlay

def show_road_mask(image, mask, title="Road Detection", save_path=None):
    """
    Display the original image, road mask, and overlay.
    
    Parameters:
    image (numpy.ndarray): The original image
    mask (numpy.ndarray): Binary road mask
    title (str): Title for the figure
    save_path (str): Path to save the output image (optional)
    """
    # Create overlay
    overlay = overlay_road_mask(image, mask)
    
    # Create figure with subplots
    fig, axs = plt.subplots(1, 3, figsize=(15, 5))
    
    # Original image
    axs[0].imshow(image)
    axs[0].set_title("Original Image")
    axs[0].axis("off")
    
    # Binary mask
    axs[1].imshow(mask, cmap="gray")
    axs[1].set_title("Road Mask")
    axs[1].axis("off")
    
    # Overlay
    axs[2].imshow(overlay)
    axs[2].set_title("Road Overlay")
    axs[2].axis("off")
    
    plt.suptitle(title)
    plt.tight_layout()
    
    # Save if path is provided
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches="tight")
    
    plt.show()

def generate_road_mask_overlay(image_path, model_name, output_path=None, display=True):
    """
    Generate a road mask overlay for an image and optionally save it.
    
    Parameters:
    image_path (str): Path to the input image
    model_name (str): Name of the model to use
    output_path (str): Path to save the overlay image (optional)
    display (bool): Whether to display the results
    
    Returns:
    numpy.ndarray: Image with road mask overlay
    """
    # Load image
    image = plt.imread(image_path)
    
    # Ensure image is RGB and 256x256
    if image.shape[0] != 256 or image.shape[1] != 256:
        image = cv2.resize(image, (256, 256))
    
    if len(image.shape) == 2:
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
    elif image.shape[2] == 4:  # RGBA
        image = image[:,:,:3]
    
    # Load model
    model = get_unet_model(model_name)
    if model is None:
        return None
    
    # Extract road mask
    mask = extract_road_mask(model, image)
    
    # Create overlay
    overlay = overlay_road_mask(image, mask)
    
    # Display if requested
    if display:
        image_name = os.path.basename(image_path)
        show_road_mask(image, mask, title=f"Road Detection - {image_name}", save_path=output_path)
    elif output_path:
        # Save overlay without displaying
        plt.imsave(output_path, overlay)
    
    return overlay

def trace_roads(mask):
    """
    Trace the road network from a binary mask.
    
    Parameters:
    mask (numpy.ndarray): Binary road mask
    
    Returns:
    list: List of LineString objects representing the road network
    """
    # Skeletonize the mask to get the road centerlines
    skeleton = skeletonize(mask)
    
    # Convert the skeleton to a list of polylines
    return skeleton_to_polylines(skeleton)

def skeleton_to_polylines(skeleton):
    """
    Convert a skeletonized mask to vector polylines.
    
    Parameters:
    skeleton (numpy.ndarray): Skeletonized binary image
    
    Returns:
    list: List of LineString objects
    """
    # Find contours in the skeleton
    skeleton = (skeleton * 255).astype(np.uint8)
    contours, _ = cv2.findContours(skeleton, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    
    polylines = []
    for contour in contours:
        # Skip contours that are too small
        if len(contour) < 2:
            continue
        
        # Convert contour to polyline
        points = [tuple(point[0]) for point in contour]
        
        # Simplify the polyline with Douglas-Peucker algorithm
        if len(points) > 2:
            epsilon = 0.5  # Adjust this value to control simplification
            points = cv2.approxPolyDP(np.array(points), epsilon, False)
            points = [tuple(point[0]) for point in points]
        
        if len(points) >= 2:
            polylines.append(LineString(points))
    
    return polylines

def create_shapefile(polylines, output_path, crs=None):
    """
    Create a shapefile from a list of polylines.
    
    Parameters:
    polylines (list): List of shapely LineString objects
    output_path (str): Path to save the shapefile
    crs (str): Coordinate reference system (e.g., 'EPSG:4326')
    
    Returns:
    bool: True if successful, False otherwise
    """
    if not polylines:
        print("No polylines to save")
        return False
    
    # Create a GeoDataFrame
    gdf = gpd.GeoDataFrame({'geometry': polylines})
    
    # Set the CRS if provided
    if crs:
        gdf.crs = crs
    
    # Save as shapefile
    gdf.to_file(output_path)
    print(f"Shapefile saved to {output_path}")
    return True

def visualize_road_detection(image, mask, polylines=None, title="Road Detection Results", save_path=None):
    """
    Comprehensive visualization of road detection results.
    
    Parameters:
    image (numpy.ndarray): Original image
    mask (numpy.ndarray): Binary road mask
    polylines (list): List of LineString objects (optional)
    title (str): Figure title
    save_path (str): Path to save the figure (optional)
    """
    if polylines is None:
        # Create a 1x3 figure with image, mask, and overlay
        fig, axs = plt.subplots(1, 3, figsize=(15, 5))
        
        # Original image
        axs[0].imshow(image)
        axs[0].set_title("Original Image")
        axs[0].axis("off")
        
        # Binary mask
        axs[1].imshow(mask, cmap="gray")
        axs[1].set_title("Road Mask")
        axs[1].axis("off")
        
        # Overlay
        overlay = overlay_road_mask(image, mask)
        axs[2].imshow(overlay)
        axs[2].set_title("Road Overlay")
        axs[2].axis("off")
    else:
        # Create a 2x2 figure with image, mask, overlay, and vector
        fig, axs = plt.subplots(2, 2, figsize=(12, 10))
        
        # Original image
        axs[0, 0].imshow(image)
        axs[0, 0].set_title("Original Image")
        axs[0, 0].axis("off")
        
        # Binary mask
        axs[0, 1].imshow(mask, cmap="gray")
        axs[0, 1].set_title("Road Mask")
        axs[0, 1].axis("off")
        
        # Overlay
        overlay = overlay_road_mask(image, mask)
        axs[1, 0].imshow(overlay)
        axs[1, 0].set_title("Road Overlay")
        axs[1, 0].axis("off")
        
        # Vector output
        axs[1, 1].imshow(image)
        for line in polylines:
            x, y = line.xy
            axs[1, 1].plot(x, y, 'r-', linewidth=1)
        axs[1, 1].set_title("Road Vector")
        axs[1, 1].axis("off")
    
    plt.suptitle(title)
    plt.tight_layout()
    
    # Save if path is provided
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches="tight")
    
    plt.show()

def image_to_shapefile(image_path, model_name, output_path, crs=None, visualize=False):
    """
    Process an image to extract roads and create a shapefile.
    
    Parameters:
    image_path (str): Path to the input image
    model_name (str): Name of the model to use
    output_path (str): Path to save the shapefile
    crs (str): Coordinate reference system (optional)
    visualize (bool): Whether to visualize the results
    
    Returns:
    tuple: (success (bool), mask (numpy.ndarray), polylines (list))
    """
    # Load image
    image = plt.imread(image_path)
    
    # Ensure image is RGB and 256x256
    if image.shape[0] != 256 or image.shape[1] != 256:
        image = cv2.resize(image, (256, 256))
    
    if len(image.shape) == 2:
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
    elif image.shape[2] == 4:  # RGBA
        image = image[:,:,:3]
    
    # Load model
    model = get_unet_model(model_name)
    if model is None:
        return False
    
    # Extract road mask
    mask = extract_road_mask(model, image)
    
    # Trace roads
    polylines = trace_roads(mask)
    
    # Create shapefile
    success = create_shapefile(polylines, output_path, crs)
    
    # Visualize if requested
    if visualize and success:
        visualize_road_detection(image, mask, polylines, 
                               title=f"Road Detection - {os.path.basename(image_path)}")
    
    return success, mask, polylines

def batch_process(image_folder, model_name, output_folder, save_overlays=True, crs=None):
    """
    Process multiple images to extract roads and create shapefiles.
    
    Parameters:
    image_folder (str): Path to folder containing input images
    model_name (str): Name of the model to use
    output_folder (str): Path to save output shapefiles
    save_overlays (bool): Whether to save overlay images
    crs (str): Coordinate reference system (optional)
    """
    # Create output folder if it doesn't exist
    os.makedirs(output_folder, exist_ok=True)
    
    # Create overlay subfolder if requested
    if save_overlays:
        overlay_folder = os.path.join(output_folder, "overlays")
        os.makedirs(overlay_folder, exist_ok=True)
    
    # Get list of image files
    image_files = [f for f in os.listdir(image_folder) if f.endswith(('.jpg', '.jpeg', '.png'))]
    
    for image_file in image_files:
        image_path = os.path.join(image_folder, image_file)
        base_name = os.path.splitext(image_file)[0]
        shapefile_path = os.path.join(output_folder, f"{base_name}.shp")
        
        print(f"Processing {image_file}...")
        success, mask, polylines = image_to_shapefile(image_path, model_name, shapefile_path, crs)
        
        if success:
            print(f"Successfully created shapefile for {image_file}")
            
            # Save overlay if requested
            if save_overlays:
                # Load original image again
                image = plt.imread(image_path)
                if image.shape[0] != 256 or image.shape[1] != 256:
                    image = cv2.resize(image, (256, 256))
                
                # Create overlay
                overlay = overlay_road_mask(image, mask)
                overlay_path = os.path.join(overlay_folder, f"{base_name}_overlay.png")
                plt.imsave(overlay_path, overlay)
                
                print(f"Saved overlay image to {overlay_path}")
        else:
            print(f"Failed to create shapefile for {image_file}")


"""
Road Extraction from Satellite Imagery

This module provides functionality to extract road networks from satellite imagery
using a U-Net deep learning model. It includes functions for:
- Loading and applying pre-trained models
- Processing and visualizing road masks
- Converting raster masks to vector polylines
- Creating shapefiles for GIS applications
- Batch processing multiple images
"""

if __name__ == "__main__":
    """
    Main execution block for road extraction pipeline.
    
    This block demonstrates various ways to use the road extraction functionality:
    1. Generate and display a road mask overlay for a single image
    2. Process an image to create a shapefile with road vectors
    3. Batch process multiple images
    """
    project_path = '/dl_model/' 
    model_name = 'unet_scratch_augmentated' 
    image_folder = os.path.join(project_path, 'test_images')
    output_folder_shp = os.path.join(project_path, 'road_shapefiles')
    output_folder_mask = os.path.join(project_path, 'road_masks')
    
 
    image_path = os.path.join(image_folder, '100034_sat.jpg')
    output_path = os.path.join(output_folder_shp, '100034_roads.shp')
    overlay_path = os.path.join(output_folder_mask, '100034_overlay.png')
    
    generate_road_mask_overlay(image_path, model_name, overlay_path)
    
    # Process image to shapefile and visualize
    # image_to_shapefile(image_path, model_name, output_path, visualize=True)
    
    # For batch processing
    # batch_process(image_folder, model_name, output_folder, save_overlays=True)