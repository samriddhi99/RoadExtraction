import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Dropout, Concatenate, Conv2DTranspose, BatchNormalization
import cv2
import matplotlib.pyplot as plt

def unet(input_shape, output_layer):
    inputs = Input(input_shape)

    # Encoder
    conv1 = Conv2D(16, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(inputs)
    conv1 = BatchNormalization()(conv1)
    conv1 = Conv2D(16, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(conv1)
    conv1 = BatchNormalization()(conv1)
    conv1 = Dropout(0.1)(conv1)
    pool1 = MaxPooling2D(pool_size=(2, 2))(conv1)

    conv2 = Conv2D(32, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(pool1)
    conv2 = BatchNormalization()(conv2)
    conv2 = Conv2D(32, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(conv2)
    conv2 = BatchNormalization()(conv2)
    pool2 = MaxPooling2D(pool_size=(2, 2))(conv2)
    conv2 = Dropout(0.1)(conv2)

    conv3 = Conv2D(64, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(pool2)
    conv3 = BatchNormalization()(conv3)
    conv3 = Conv2D(64, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(conv3)
    conv3 = BatchNormalization()(conv3)
    pool3 = MaxPooling2D(pool_size=(2, 2))(conv3)
    conv3 = Dropout(0.2)(conv3)

    conv4 = Conv2D(128, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(pool3)
    conv4 = BatchNormalization()(conv4)
    conv4 = Conv2D(128, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(conv4)
    conv4 = BatchNormalization()(conv4)
    pool4 = MaxPooling2D(pool_size=(2, 2))(conv4)
    conv4 = Dropout(0.2)(conv4)

    # Bottom
    conv5 = Conv2D(256, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(pool4)
    conv5 = BatchNormalization()(conv5)
    conv5 = Conv2D(256, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(conv5)
    conv5 = BatchNormalization()(conv5)
    conv5 = Dropout(0.3)(conv5)

    # Decoder
    up6 = Conv2DTranspose(128, (2, 2), strides=(2, 2), padding='same')(conv5)
    merge6 = Concatenate()([conv4, up6])
    conv6 = Dropout(0.2)(merge6)
    conv6 = Conv2D(128, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(conv6)
    conv6 = BatchNormalization()(conv6)
    conv6 = Conv2D(128, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(conv6)
    conv6 = BatchNormalization()(conv6)

    up7 = Conv2DTranspose(64, (2, 2), strides=(2, 2), padding='same')(conv6)
    merge7 = Concatenate()([conv3, up7])
    conv7 = Dropout(0.2)(merge7)
    conv7 = Conv2D(64, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(conv7)
    conv7 = BatchNormalization()(conv7)
    conv7 = Conv2D(64, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(conv7)
    conv7 = BatchNormalization()(conv7)

    up8 = Conv2DTranspose(32, (2, 2), strides=(2, 2), padding='same')(conv7)
    merge8 = Concatenate()([conv2, up8])
    conv8 = Dropout(0.1)(merge8)
    conv8 = Conv2D(32, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(conv8)
    conv8 = BatchNormalization()(conv8)
    conv8 = Conv2D(32, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(conv8)
    conv8 = BatchNormalization()(conv8)

    up9 = Conv2DTranspose(16, (2, 2), strides=(2, 2), padding='same')(conv8)
    merge9 = Concatenate()([conv1, up9])
    conv9 = Dropout(0.1)(merge9)
    conv9 = Conv2D(16, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(conv9)
    conv9 = BatchNormalization()(conv9)
    conv9 = Conv2D(16, (3, 3), activation='relu', kernel_initializer='he_normal', padding='same')(conv9)
    conv9 = BatchNormalization()(conv9)

    # Output
    output = Conv2D(output_layer, (1, 1), activation='sigmoid')(conv9)

    model = Model(inputs=inputs, outputs=output)
    return model

def load_model_weights(model_path):
    """
    Robust model loading with weight transfer
    """
    # Recreate the model with the same architecture
    model = unet(input_shape=(256, 256, 3), output_layer=1)
    
    try:
        # Try loading weights
        model.load_weights(model_path)
        return model
    except Exception as e:
        print(f"Error loading weights: {e}")
        
        try:
            # Alternative loading method
            old_model = tf.keras.models.load_model(model_path)
            
            # Transfer weights layer by layer
            for new_layer, old_layer in zip(model.layers, old_model.layers):
                try:
                    new_layer.set_weights(old_layer.get_weights())
                except Exception as transfer_error:
                    print(f"Could not transfer weights for layer {new_layer.name}: {transfer_error}")
            
            return model
        except Exception as load_error:
            print(f"Comprehensive loading failed: {load_error}")
            raise

def predict_road_mask(model, image_path, input_size=(256, 256)):
    """
    Predict road mask for a given image using the trained model.
    """
    # Read the image
    original_image = cv2.imread(image_path)
    original_image = cv2.cvtColor(original_image, cv2.COLOR_BGR2RGB)
    
    # Resize and preprocess the image
    resized_image = cv2.resize(original_image, input_size)
    normalized_image = resized_image / 255.0
    
    # Prepare image for model prediction (add batch dimension)
    input_image = np.expand_dims(normalized_image, axis=0)
    
    # Predict road mask
    predicted_mask = model.predict(input_image)
    predicted_mask = (predicted_mask > 0.5).astype(np.uint8)[0]
    
    # Create overlay
    yellow_mask = np.zeros_like(resized_image)
    yellow_mask[predicted_mask[:,:,0] == 1] = [255, 255, 0]  # Yellow color for roads
    
    overlay_image = cv2.addWeighted(resized_image, 0.7, yellow_mask, 0.3, 0)
    
    return original_image, predicted_mask, overlay_image

def visualize_prediction(original_image, predicted_mask, overlay_image):
    """
    Visualize the prediction results.
    """
    plt.figure(figsize=(15, 5))
    
    plt.subplot(1, 3, 1)
    plt.title('Original Image')
    plt.imshow(original_image)
    plt.axis('off')
    
    plt.subplot(1, 3, 2)
    plt.title('Predicted Road Mask')
    plt.imshow(predicted_mask[:,:,0], cmap='gray')
    plt.axis('off')
    
    plt.subplot(1, 3, 3)
    plt.title('Road Mask Overlay')
    plt.imshow(overlay_image)
    plt.axis('off')
    
    plt.tight_layout()
    plt.show()

def main(model_path, input_image_path):
    # Load the model
    model = load_model_weights(model_path)
    
    # Predict road mask
    original, mask, overlay = predict_road_mask(model, input_image_path)
    
    # Visualize results
    visualize_prediction(original, mask, overlay)
    
    # Optional: Save the results
    cv2.imwrite('original_image.jpg', cv2.cvtColor(original, cv2.COLOR_RGB2BGR))
    cv2.imwrite('road_mask.jpg', mask[:,:,0] * 255)
    cv2.imwrite('road_mask_overlay.jpg', cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR))

if __name__ == "__main__":
    MODEL_PATH = 'models/roads_extraction.h5'
    INPUT_IMAGE_PATH = 'path/to/your/input_image.jpg'
    
    main(MODEL_PATH, INPUT_IMAGE_PATH)