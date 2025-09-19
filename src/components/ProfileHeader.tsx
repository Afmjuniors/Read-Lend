import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { User } from '../types';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';
import { getNameError } from '../utils/validation';
import { FoldableCard } from './FoldableCard';

interface ProfileHeaderProps {
  user: User;
  onUpdateProfile: (updatedUser: Partial<User>) => Promise<void>;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(user.image || null);
  const [editData, setEditData] = useState({
    name: user.name,
    phone: user.phone || '',
    address: user.address || '',
    additionalInfo: user.additionalInfo || '',
  });

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão Necessária',
        'Precisamos de permissão para acessar sua galeria de fotos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão Necessária',
        'Precisamos de permissão para acessar sua câmera.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao selecionar imagem');
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao tirar foto');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Selecionar Foto',
      'Escolha como deseja adicionar sua foto:',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Tirar Foto',
          onPress: takePhoto,
        },
        {
          text: 'Escolher da Galeria',
          onPress: pickImage,
        },
      ]
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Validar dados
      const nameError = getNameError(editData.name);
      if (nameError) {
        Alert.alert('Erro', nameError);
        return;
      }

      const phoneError = editData.phone ? null : null; // Phone é opcional
      if (phoneError) {
        Alert.alert('Erro', phoneError);
        return;
      }

      // Aqui você enviaria a imagem para o servidor
      // Por enquanto, vamos simular o upload
      const updatedData = {
        ...editData,
        image: selectedImage || undefined,
      };

      await onUpdateProfile(updatedData);
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: user.name,
      phone: user.phone || '',
      address: user.address || '',
      additionalInfo: user.additionalInfo || '',
    });
    setSelectedImage(user.image || null);
    setIsEditing(false);
  };

  const getUserStatus = () => {
    // Simular status baseado na data de criação e atividade
    const memberSince = new Date(user.createdAt || '');
    const now = new Date();
    const daysSinceMember = Math.floor((now.getTime() - memberSince.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceMember < 7) {
      return { text: 'Novo Membro', color: COLORS.info, icon: '🆕' };
    } else if (daysSinceMember < 30) {
      return { text: 'Membro Ativo', color: COLORS.success, icon: '✅' };
    } else if (daysSinceMember < 90) {
      return { text: 'Membro Experiente', color: COLORS.warning, icon: '⭐' };
    } else {
      return { text: 'Membro Veterano', color: COLORS.primary, icon: '👑' };
    }
  };

  const renderPersonalInfo = () => (
    <View style={styles.personalInfoContent}>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Nome:</Text>
        <Text style={styles.infoValue}>{user.name}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>{user.email}</Text>
      </View>
      
      {user.phone && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Telefone:</Text>
          <Text style={styles.infoValue}>{user.phone}</Text>
        </View>
      )}
      
      {user.address && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Endereço:</Text>
          <Text style={styles.infoValue}>{user.address}</Text>
        </View>
      )}
      
      {user.additionalInfo && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Informações:</Text>
          <Text style={styles.infoValue}>{user.additionalInfo}</Text>
        </View>
      )}
      
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setIsEditing(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.editButtonText}>✏️ Editar Informações</Text>
      </TouchableOpacity>
    </View>
  );

  const userStatus = getUserStatus();

  return (
    <View style={styles.container}>
      {/* Avatar e Informações Básicas */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
        <View style={styles.basicInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.memberSince}>
            Membro desde {new Date(user.createdAt || '').toLocaleDateString('pt-BR')}
          </Text>
          
          {/* Status do Usuário */}
          <View style={[styles.statusBadge, { backgroundColor: userStatus.color }]}>
            <Text style={styles.statusIcon}>{userStatus.icon}</Text>
            <Text style={styles.statusText}>{userStatus.text}</Text>
          </View>
        </View>
      </View>

      {/* Estatísticas Integradas */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Livros</Text>
        </View>
        <View style={styles.statDivider} />
                           <View style={styles.statItem}>
                     <Text style={styles.statNumber}>5</Text>
                     <Text style={styles.statLabel}>Disponibilizados</Text>
                   </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Histórico</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>Organizações</Text>
        </View>
      </View>

      {/* Card Expansível - Informações Pessoais */}
      <FoldableCard
        title="Informações Pessoais"
        subtitle="Dados pessoais e contato"
        icon="👤"
        headerColor={COLORS.primary}
        initiallyExpanded={false}
      >
        {renderPersonalInfo()}
      </FoldableCard>

      {/* Modal de Edição */}
      <Modal
        visible={isEditing}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                {/* Seção de Foto */}
                <View style={styles.photoSection}>
                  <Text style={styles.sectionTitle}>Foto do Perfil</Text>
                  <View style={styles.photoContainer}>
                    <View style={styles.photoPreview}>
                      {selectedImage ? (
                        <Image source={{ uri: selectedImage }} style={styles.photoImage} />
                      ) : (
                        <Text style={styles.photoPlaceholder}>
                          {user.name.charAt(0).toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.photoButton}
                      onPress={showImagePickerOptions}
                    >
                      <Text style={styles.photoButtonText}>📷 Alterar Foto</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Nome *</Text>
                  <TextInput
                    style={styles.input}
                    value={editData.name}
                    onChangeText={(text) => setEditData({ ...editData, name: text })}
                    placeholder="Seu nome completo"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Telefone</Text>
                  <TextInput
                    style={styles.input}
                    value={editData.phone}
                    onChangeText={(text) => setEditData({ ...editData, phone: text })}
                    placeholder="(11) 99999-9999"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Endereço</Text>
                  <TextInput
                    style={styles.input}
                    value={editData.address}
                    onChangeText={(text) => setEditData({ ...editData, address: text })}
                    placeholder="Seu endereço"
                    multiline
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Informações Adicionais</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={editData.additionalInfo}
                    onChangeText={(text) => setEditData({ ...editData, additionalInfo: text })}
                    placeholder="Informações sobre você..."
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </ScrollView>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancel}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                <Text style={styles.saveButtonText}>
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  avatarText: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
  },
  basicInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  memberSince: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginBottom: SPACING.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusIcon: {
    fontSize: FONT_SIZES.sm,
    marginRight: SPACING.xs,
  },
  statusText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.gray[300],
  },
  personalInfoContent: {
    paddingTop: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.secondary,
    width: 80,
    marginRight: SPACING.sm,
  },
  infoValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.primary,
    flex: 1,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
    flexDirection: 'column',
  },
  modalBody: {
    flex: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
  formContainer: {
    padding: SPACING.lg,
    flex: 1,
  },
  photoSection: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  photoContainer: {
    alignItems: 'center',
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  photoPlaceholder: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
  },
  photoButton: {
    backgroundColor: COLORS.info,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  photoButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    backgroundColor: COLORS.white,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    gap: SPACING.md,
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    backgroundColor: COLORS.gray[100],
  },
  cancelButtonText: {
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHTS.semibold,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHTS.semibold,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
}); 