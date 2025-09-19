import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
} from 'react-native';
import { Book, Genre, GENRES } from '../types';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants';
import { useImagePicker } from '../hooks/useImagePicker';
import { getNameError } from '../utils/validation';
import { Alert } from 'react-native';

interface BookFormProps {
  initialData?: Partial<Book>;
  onSave: (bookData: Omit<Book, 'bookId' | 'createdAt'>) => void;
  onCancel: () => void;
  title?: string;
}

export const BookForm: React.FC<BookFormProps> = ({
  initialData,
  onSave,
  onCancel,
  title = 'Adicionar Livro',
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    author: initialData?.author || '',
    genre: initialData?.genre || 0, // 0 significa nenhum gênero selecionado
    description: initialData?.description || '',
    url: initialData?.url || '',
  });
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(
    initialData?.genre ? GENRES.find(g => g.id === initialData.genre) || null : null
  );
  const [showGenreModal, setShowGenreModal] = useState(false);

  const { selectedImage, showImagePickerOptions, clearImage } = useImagePicker();

  const handleSave = () => {
    // Validação
    const nameError = getNameError(formData.name);
    if (nameError) {
      Alert.alert('Erro', nameError);
      return;
    }

    const authorError = getNameError(formData.author);
    if (authorError) {
      Alert.alert('Erro', authorError);
      return;
    }

    if (!selectedGenre) {
      Alert.alert('Erro', 'Por favor, selecione um gênero');
      return;
    }

    const bookData: Omit<Book, 'bookId' | 'createdAt'> = {
      name: formData.name.trim(),
      author: formData.author.trim(),
      genre: selectedGenre.id,
      description: formData.description.trim(),
      url: formData.url.trim(),
      image: selectedImage || '',
      bookStatusId: 1, // Disponível
      ownerId: 0, // Será definido pelo hook
    };

    onSave(bookData);
  };

  const handleImagePicker = async () => {
    const imageUri = await showImagePickerOptions();
    if (imageUri) {
      // A imagem já é definida pelo hook
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nome do Livro *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Digite o nome do livro" 
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Autor *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Digite o nome do autor" 
            value={formData.author}
            onChangeText={(text) => setFormData(prev => ({ ...prev, author: text }))}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Gênero *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowGenreModal(true)}
          >
            <Text style={[styles.genrePickerText, selectedGenre && { color: COLORS.text.primary }]}>
              {selectedGenre ? selectedGenre.name : 'Selecione o gênero'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Digite uma descrição do livro"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>URL para compra (opcional)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="https://..." 
            value={formData.url}
            onChangeText={(text) => setFormData(prev => ({ ...prev, url: text }))}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Imagem (opcional)</Text>
          <View style={styles.imageSection}>
            <View style={styles.imagePreview}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.bookImage} />
              ) : (
                <Text style={styles.imagePlaceholder}>📚</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={handleImagePicker}
            >
              <Text style={styles.imagePickerText}>
                {selectedImage ? '📷 Alterar Imagem' : '📷 Selecionar Imagem'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Livro</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal do Dropdown de Gênero */}
      <Modal
        visible={showGenreModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGenreModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Gênero</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowGenreModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.genreList}>
              {GENRES.map((genre) => (
                <TouchableOpacity
                  key={genre.id}
                  style={[
                    styles.genreOption,
                    selectedGenre?.id === genre.id && styles.genreOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedGenre(genre);
                    setFormData(prev => ({ ...prev, genre: genre.id }));
                    setShowGenreModal(false);
                  }}
                >
                  <Text style={[
                    styles.genreOptionText,
                    selectedGenre?.id === genre.id && styles.genreOptionTextSelected
                  ]}>
                    {genre.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flex: 1,
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  closeButtonText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.text.secondary,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    backgroundColor: COLORS.white,
  },
  genrePickerText: {
    color: COLORS.text.secondary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  imagePreview: {
    width: 80,
    height: 100,
    backgroundColor: COLORS.gray[200],
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bookImage: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.md,
  },
  imagePlaceholder: {
    fontSize: 32,
    color: COLORS.gray[400],
  },
  imagePickerButton: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  imagePickerText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    width: '80%',
    maxHeight: '70%',
    padding: SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
  },
  modalCloseButton: {
    padding: SPACING.sm,
  },
  modalCloseText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.text.secondary,
  },
  genreList: {
    maxHeight: 300,
  },
  genreOption: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
  },
  genreOptionSelected: {
    backgroundColor: COLORS.primary,
  },
  genreOptionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
  },
  genreOptionTextSelected: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHTS.semibold,
  },
}); 