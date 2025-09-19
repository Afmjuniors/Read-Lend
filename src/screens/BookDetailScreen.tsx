import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  Alert,
  Modal,
} from 'react-native';
import { Book, getGenreText, getStatusText, getStatusColor } from '../types';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';
import { User } from '../types';

interface BookDetailScreenProps {
  book: Book;
  currentUserId: number;
  isVisible: boolean;
  onClose: () => void;
  onEdit?: (book: Book) => void;
  onDelete?: (bookId: number) => void;
  onRequestLoan?: (bookId: number) => void;
  onReturnBook?: (bookId: number) => void;
  onViewUserProfile?: (user: User) => void;
  onOpenVisibility?: (book: Book) => void;
}

export const BookDetailScreen: React.FC<BookDetailScreenProps> = ({
  book,
  currentUserId,
  isVisible,
  onClose,
  onEdit,
  onDelete,
  onRequestLoan,
  onReturnBook,
  onViewUserProfile,
  onOpenVisibility,
}) => {
  const [showActionModal, setShowActionModal] = useState(false);

  const isMyBook = book.ownerId === currentUserId;
  console.log('BookDetailScreen - isMyBook:', isMyBook, 'book.ownerId:', book.ownerId, 'currentUserId:', currentUserId);
  const isAvailable = book.bookStatusId === 1;
  const isLent = book.bookStatusId === 2;
  const isReserved = book.bookStatusId === 3;

  const handleOpenUrl = async () => {
    if (book.url) {
      try {
        await Linking.openURL(book.url);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível abrir o link');
      }
    }
  };

  const handleRequestLoan = () => {
    if (onRequestLoan) {
      onRequestLoan(book.bookId);
      onClose();
    }
  };

  const handleReturnBook = () => {
    if (onReturnBook) {
      onReturnBook(book.bookId);
      onClose();
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(book);
      onClose();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir "${book.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            if (onDelete) {
              onDelete(book.bookId);
              onClose();
            }
          },
        },
      ]
    );
  };

  const renderActionButtons = () => {
    const buttons = [];

    if (isMyBook) {
      // Meus livros
      if (isAvailable) {
        buttons.push(
          <TouchableOpacity
            key="edit"
            style={[styles.actionButton, styles.editButton]}
            onPress={handleEdit}
          >
            <Text style={styles.actionButtonText}>✏️ Editar</Text>
          </TouchableOpacity>
        );
      }
      
      buttons.push(
        <TouchableOpacity
          key="delete"
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.actionButtonText}>🗑️ Excluir</Text>
        </TouchableOpacity>
      );
    } else {
      // Livros de outros usuários
      if (isAvailable) {
        buttons.push(
          <TouchableOpacity
            key="request"
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleRequestLoan}
          >
            <Text style={styles.actionButtonText}>📚 Solicitar Empréstimo</Text>
          </TouchableOpacity>
        );
      } else if (isLent && !isMyBook) {
        buttons.push(
          <TouchableOpacity
            key="return"
            style={[styles.actionButton, styles.successButton]}
            onPress={handleReturnBook}
          >
            <Text style={styles.actionButtonText}>📖 Marcar como Lido</Text>
          </TouchableOpacity>
        );
      }
    }

    return buttons;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes do Livro</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Imagem do Livro */}
          <View style={styles.imageSection}>
            {book.image ? (
              <Image source={{ uri: book.image }} style={styles.bookImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>📚</Text>
              </View>
            )}
          </View>

          {/* Informações Principais */}
          <View style={styles.mainInfo}>
            <Text style={styles.bookTitle}>{book.name}</Text>
            <Text style={styles.bookAuthor}>por {book.author}</Text>
            
            <View style={styles.badgesContainer}>
              <View style={[styles.badge, { backgroundColor: COLORS.primary }]}>
                <Text style={styles.badgeText}>{getGenreText(book.genre)}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: getStatusColor(book.bookStatusId) }]}>
                <Text style={styles.badgeText}>{getStatusText(book.bookStatusId)}</Text>
              </View>
            </View>
          </View>

          {/* Descrição */}
          {book.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📖 Sinopse</Text>
              <Text style={styles.descriptionText}>{book.description}</Text>
            </View>
          )}

          {/* Informações Técnicas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Informações</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID do Livro:</Text>
              <Text style={styles.infoValue}>#{book.bookId}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Proprietário:</Text>
              <Text style={styles.infoValue}>
                {isMyBook ? 'Você' : `Usuário #${book.ownerId}`}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Adicionado em:</Text>
              <Text style={styles.infoValue}>{formatDate(book.createdAt)}</Text>
            </View>
            
            {book.updatedAt && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Atualizado em:</Text>
                <Text style={styles.infoValue}>{formatDate(book.updatedAt)}</Text>
              </View>
            )}
          </View>

          {/* Card do Proprietário */}
          {book.ownerInfo && !isMyBook && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>👤 Proprietário</Text>
              
              <View style={styles.ownerCard}>
                {/* Header do Proprietário */}
                <View style={styles.ownerHeader}>
                  <View style={styles.ownerAvatar}>
                    {book.ownerInfo.image ? (
                      <Image source={{ uri: book.ownerInfo.image }} style={styles.ownerImage} />
                    ) : (
                      <Text style={styles.ownerInitial}>
                        {book.ownerInfo.name.charAt(0).toUpperCase()}
                      </Text>
                    )}
                  </View>
                  
                  <View style={styles.ownerInfo}>
                    <Text style={styles.ownerName}>{book.ownerInfo.name}</Text>
                    <Text style={styles.ownerEmail}>{book.ownerInfo.email}</Text>
                    {book.ownerInfo.organization && (
                      <View style={styles.organizationBadge}>
                        <Text style={styles.organizationText}>
                          {book.ownerInfo.organization}
                        </Text>
                        {book.ownerInfo.organizationRole && (
                          <Text style={styles.roleText}>
                            • {book.ownerInfo.organizationRole}
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                </View>

                {/* Estatísticas do Proprietário */}
                <View style={styles.ownerStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{book.ownerInfo.totalBooks}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{book.ownerInfo.booksAvailable}</Text>
                    <Text style={styles.statLabel}>Disponíveis</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{book.ownerInfo.booksLent}</Text>
                    <Text style={styles.statLabel}>Disponibilizados</Text>
                  </View>
                </View>

                {/* Botão para Ver Perfil */}
                <TouchableOpacity
                  style={styles.viewProfileButton}
                  onPress={() => {
                    if (onViewUserProfile && book.ownerInfo) {
                      const ownerUser: User = {
                        userId: book.ownerId,
                        name: book.ownerInfo.name,
                        email: book.ownerInfo.email,
                        image: book.ownerInfo.image,
                        createdAt: book.createdAt,
                      };
                      onViewUserProfile(ownerUser);
                      onClose();
                    } else {
                      Alert.alert('Erro', 'Não foi possível abrir o perfil do usuário');
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewProfileText}>👁️ Ver Perfil Completo</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Informações de Empréstimo */}
          {book.loanInfo && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {isMyBook ? '📤 Emprestado Para' : '📥 Emprestado De'}
              </Text>
              
              <View style={styles.loanCard}>
                <View style={styles.loanHeader}>
                  <Text style={styles.borrowerName}>{book.loanInfo.borrowerName}</Text>
                  {book.loanInfo.isOverdue && (
                    <View style={styles.overdueBadge}>
                      <Text style={styles.overdueText}>ATRASADO</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.borrowerEmail}>{book.loanInfo.borrowerEmail}</Text>
                
                <View style={styles.loanDates}>
                  <View style={styles.dateRow}>
                    <Text style={styles.dateLabel}>📅 Emprestado em:</Text>
                    <Text style={styles.dateValue}>{formatDate(book.loanInfo.loanDate)}</Text>
                  </View>
                  
                  <View style={styles.dateRow}>
                    <Text style={styles.dateLabel}>📅 Devolução até:</Text>
                    <Text style={[
                      styles.dateValue,
                      book.loanInfo.isOverdue && styles.overdueDate
                    ]}>
                      {formatDate(book.loanInfo.returnDate)}
                    </Text>
                  </View>
                </View>
                
                {book.loanInfo.isOverdue && (
                  <View style={styles.overdueWarning}>
                    <Text style={styles.overdueWarningText}>
                      ⚠️ Este livro está atrasado para devolução
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Link para Compra */}
          {book.url && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🛒 Onde Comprar</Text>
              <TouchableOpacity
                style={styles.urlButton}
                onPress={handleOpenUrl}
                activeOpacity={0.7}
              >
                <Text style={styles.urlButtonText}>🔗 Abrir Link</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Ações */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚡ Ações</Text>
            <View style={styles.actionsContainer}>
              {renderActionButtons()}
              
              {/* Botão de Visibilidade (apenas para meus livros) */}
              {isMyBook && onOpenVisibility && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.visibilityButton]}
                  onPress={() => {
                    console.log('Botão Visibilidade pressionado');
                    onOpenVisibility(book);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionButtonText}>👁️ Visibilidade</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    backgroundColor: COLORS.white,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHTS.bold,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  imageSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.gray[50],
  },
  bookImage: {
    width: 200,
    height: 280,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.medium,
  },
  imagePlaceholder: {
    width: 200,
    height: 280,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  imagePlaceholderText: {
    fontSize: 80,
  },
  mainInfo: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  bookTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  bookAuthor: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  section: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  descriptionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[50],
  },
  infoLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  urlButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  urlButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  actionsContainer: {
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  editButton: {
    backgroundColor: COLORS.warning,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  successButton: {
    backgroundColor: COLORS.success,
  },
  loanCard: {
    backgroundColor: COLORS.gray[50],
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.medium,
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  borrowerName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
  },
  overdueBadge: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  overdueText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  borrowerEmail: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  loanDates: {
    marginBottom: SPACING.sm,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  dateLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  dateValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.primary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  overdueDate: {
    color: COLORS.error,
    fontWeight: FONT_WEIGHTS.bold,
  },
  overdueWarning: {
    backgroundColor: COLORS.gray[100],
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  overdueWarningText: {
    color: COLORS.warning,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  ownerCard: {
    backgroundColor: COLORS.gray[50],
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.medium,
  },
  ownerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  ownerImage: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.md,
  },
  ownerInitial: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.white,
    fontWeight: FONT_WEIGHTS.bold,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  ownerEmail: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  organizationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.info,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  organizationText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  roleText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    marginLeft: SPACING.xs,
  },
  ownerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZES.xl,
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
    height: '100%',
    backgroundColor: COLORS.gray[300],
  },
  viewProfileButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  viewProfileText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  visibilityButton: {
    backgroundColor: COLORS.info,
  },
}); 