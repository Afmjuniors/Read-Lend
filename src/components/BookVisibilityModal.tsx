import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Book, Organization } from '../types';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';

interface BookVisibilityModalProps {
  book: Book;
  organizations: Organization[];
  isVisible: boolean;
  onClose: () => void;
  onSave: (visibilitySettings: Book['visibilitySettings']) => Promise<void>;
}

export const BookVisibilityModal: React.FC<BookVisibilityModalProps> = ({
  book,
  organizations,
  isVisible,
  onClose,
  onSave,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(book.visibilitySettings?.isPublic ?? true);
  const [visibleOrganizations, setVisibleOrganizations] = useState<number[]>(
    book.visibilitySettings?.visibleOrganizations ?? []
  );
  const [hiddenOrganizations, setHiddenOrganizations] = useState<number[]>(
    book.visibilitySettings?.hiddenOrganizations ?? []
  );

  useEffect(() => {
    if (isVisible) {
      setIsPublic(book.visibilitySettings?.isPublic ?? true);
      setVisibleOrganizations(book.visibilitySettings?.visibleOrganizations ?? []);
      setHiddenOrganizations(book.visibilitySettings?.hiddenOrganizations ?? []);
    }
  }, [isVisible, book]);

  const handleToggleOrganization = (organizationId: number, isVisible: boolean) => {
    if (isVisible) {
      // Adicionar à lista de visíveis e remover da lista de ocultos
      setVisibleOrganizations(prev => [...prev.filter(id => id !== organizationId), organizationId]);
      setHiddenOrganizations(prev => prev.filter(id => id !== organizationId));
    } else {
      // Adicionar à lista de ocultos e remover da lista de visíveis
      setHiddenOrganizations(prev => [...prev.filter(id => id !== organizationId), organizationId]);
      setVisibleOrganizations(prev => prev.filter(id => id !== organizationId));
    }
  };

  const isOrganizationVisible = (organizationId: number): boolean => {
    if (isPublic) {
      // Se é público, só está oculto se estiver na lista de ocultos
      return !hiddenOrganizations.includes(organizationId);
    } else {
      // Se não é público, só está visível se estiver na lista de visíveis
      return visibleOrganizations.includes(organizationId);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const visibilitySettings = {
        isPublic,
        visibleOrganizations: isPublic ? [] : visibleOrganizations,
        hiddenOrganizations: isPublic ? hiddenOrganizations : [],
      };

      await onSave(visibilitySettings);
      Alert.alert('Sucesso', 'Configurações de visibilidade salvas!');
      onClose();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar configurações de visibilidade.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Redefinir Configurações',
      'Tem certeza que deseja redefinir as configurações de visibilidade?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Redefinir',
          style: 'destructive',
          onPress: () => {
            setIsPublic(true);
            setVisibleOrganizations([]);
            setHiddenOrganizations([]);
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Visibilidade do Livro</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Informações do Livro */}
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{book.name}</Text>
              <Text style={styles.bookAuthor}>por {book.author}</Text>
            </View>

            {/* Configuração Global */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🌍 Visibilidade Global</Text>
              <View style={styles.publicToggle}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleTitle}>
                    {isPublic ? 'Público' : 'Privado'}
                  </Text>
                  <Text style={styles.toggleDescription}>
                    {isPublic 
                      ? 'Visível para todas as organizações (exceto as ocultas)'
                      : 'Visível apenas para organizações selecionadas'
                    }
                  </Text>
                </View>
                <Switch
                  value={isPublic}
                  onValueChange={setIsPublic}
                  trackColor={{ false: COLORS.gray[300], true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>
            </View>

            {/* Lista de Organizações */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                🏢 Organizações ({organizations.length})
              </Text>
              
              {organizations.map((org) => (
                <View key={org.organizationId} style={styles.organizationItem}>
                  <View style={styles.orgInfo}>
                    <Text style={styles.orgName}>{org.name}</Text>
                    <Text style={styles.orgMembers}>
                      {org.memberCount} membro{org.memberCount !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <Switch
                    value={isOrganizationVisible(org.organizationId)}
                    onValueChange={(value) => handleToggleOrganization(org.organizationId, value)}
                    trackColor={{ false: COLORS.gray[300], true: COLORS.success }}
                    thumbColor={COLORS.white}
                  />
                </View>
              ))}
            </View>

            {/* Resumo */}
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>📊 Resumo</Text>
              <Text style={styles.summaryText}>
                {isPublic 
                  ? `Visível para ${organizations.length - hiddenOrganizations.length} de ${organizations.length} organizações`
                  : `Visível para ${visibleOrganizations.length} de ${organizations.length} organizações`
                }
              </Text>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.resetButton]}
              onPress={handleReset}
              disabled={isLoading}
            >
              <Text style={styles.resetButtonText}>🔄 Redefinir</Text>
            </TouchableOpacity>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onClose}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
                disabled={isLoading}
              >
                <Text style={styles.saveButtonText}>
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    width: '90%',
    maxHeight: '85%',
    ...SHADOWS.large,
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
    padding: SPACING.xs,
  },
  closeButtonText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text.secondary,
  },
  modalBody: {
    flex: 1,
    padding: SPACING.lg,
  },
  bookInfo: {
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.md,
  },
  bookTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  bookAuthor: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  publicToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.md,
  },
  toggleInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  toggleTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  toggleDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  organizationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  orgInfo: {
    flex: 1,
  },
  orgName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  orgMembers: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  summary: {
    padding: SPACING.md,
    backgroundColor: COLORS.info + '20',
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.md,
  },
  summaryTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  summaryText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  modalButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 80,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: COLORS.gray[100],
  },
  resetButtonText: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  cancelButton: {
    backgroundColor: COLORS.gray[100],
  },
  cancelButtonText: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
}); 