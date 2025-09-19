import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

interface ImagePickerOptions {
  aspect?: [number, number];
  quality?: number;
  allowsEditing?: boolean;
}

export const useImagePicker = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const requestMediaLibraryPermissions = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua galeria.');
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua câmera.');
      return false;
    }
    return true;
  };

  const pickImage = async (options: ImagePickerOptions = {}) => {
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) return null;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: options.allowsEditing ?? true,
        aspect: options.aspect ?? [3, 4],
        quality: options.quality ?? 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        return imageUri;
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao selecionar imagem');
    }
    return null;
  };

  const takePhoto = async (options: ImagePickerOptions = {}) => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return null;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: options.allowsEditing ?? true,
        aspect: options.aspect ?? [3, 4],
        quality: options.quality ?? 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        return imageUri;
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao tirar foto');
    }
    return null;
  };

  const showImagePickerOptions = async (options: ImagePickerOptions = {}) => {
    return new Promise<string | null>((resolve) => {
      Alert.alert(
        'Selecionar Imagem',
        'Escolha uma opção:',
        [
          { text: 'Cancelar', style: 'cancel', onPress: () => resolve(null) },
          { 
            text: '📷 Tirar Foto', 
            onPress: async () => {
              const result = await takePhoto(options);
              resolve(result);
            }
          },
          { 
            text: '🖼️ Escolher da Galeria', 
            onPress: async () => {
              const result = await pickImage(options);
              resolve(result);
            }
          },
        ]
      );
    });
  };

  const clearImage = () => {
    setSelectedImage(null);
  };

  return {
    selectedImage,
    pickImage,
    takePhoto,
    showImagePickerOptions,
    clearImage,
    setSelectedImage,
  };
}; 