import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { User, Book, ExtendedOrganization, getGenreText, getStatusText, getStatusColor } from '../types';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';
import { UserOrganizationsSection } from '../components/UserOrganizationsSection';

interface UserProfileScreenProps {
  user: User;
  userBooks: Book[];
  currentUserId: number;
  isVisible: boolean;
  onClose: () => void;
  onRequestLoan?: (bookId: number) => void;
  onContactUser?: (userId: number) => void;
  userOrganizations?: ExtendedOrganization[];
  getNextMeetingInfo?: (organizationId: number) => any;
  onViewOrganization?: (organization: ExtendedOrganization) => void;
  organizationSettings?: {
    showAdditionalInfo: boolean;
    showPhone: boolean;
    showAddress: boolean;
    showPersonalInfo: boolean;
  };
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  user,
  userBooks,
  currentUserId,
  isVisible,
  onClose,
  onRequestLoan,
  onContactUser,
  userOrganizations = [],
  getNextMeetingInfo,
  onViewOrganization,
  organizationSettings = {
    showAdditionalInfo: false,
    showPhone: false,
    showAddress: false,
    showPersonalInfo: false,
  },
}) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showBookDetail, setShowBookDetail] = useState(false);

  const isMyProfile = user.userId === currentUserId;
  const availableBooks = userBooks.filter(book => book.bookStatusId === 1);
  const lentBooks = userBooks.filter(book => book.bookStatusId === 2);

  // Debug logs
  console.log('🔍 UserProfileScreen Debug:');
  console.log('  - user.userId:', user.userId);
  console.log('  - currentUserId:', currentUserId);
  console.log('  - isMyProfile:', isMyProfile);
  console.log('  - userOrganizations.length:', userOrganizations?.length || 0);
  console.log('  - userOrganizations:', userOrganizations);

  const handleBookPress = (book: Book) => {
    setSelectedBook(book);
    setShowBookDetail(true);
  };

  const handleRequestLoan = (book: Book) => {
    if (onRequestLoan) {
      onRequestLoan(book.bookId);
      setShowBookDetail(false);
    }
  };

  const handleContactUser = () => {
    if (onContactUser) {
      onContactUser(user.userId);
    } else {
      Alert.alert('Contato', `Email: ${user.email}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const renderBookCard = (book: Book) => (
    <TouchableOpacity
      key={book.bookId}
      style={styles.bookCard}
      onPress={() => handleBookPress(book)}
      activeOpacity={0.7}
    >
      <View style={styles.bookImageContainer}>
        {book.image ? (
          <Image source={{ uri: book.image }} style={styles.bookImage} />
        ) : (
          <Text style={styles.bookImagePlaceholder}>📚</Text>
        )}
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {book.name}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          por {book.author}
        </Text>
        <Text style={styles.bookGenre}>
          {getGenreText(book.genre)}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(book.bookStatusId) }]}>
          <Text style={styles.statusText}>
            {getStatusText(book.bookStatusId)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderBookDetail = () => {
    if (!selectedBook) return null;

    return (
      <Modal
        visible={showBookDetail}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBookDetail(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bookDetailModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedBook.name}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowBookDetail(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.bookDetailImage}>
                {selectedBook.image ? (
                  <Image source={{ uri: selectedBook.image }} style={styles.detailImage} />
                ) : (
                  <View style={styles.detailImagePlaceholder}>
                    <Text style={styles.detailImageText}>📚</Text>
                  </View>
                )}
              </View>

              <Text style={styles.detailAuthor}>por {selectedBook.author}</Text>
              
              {selectedBook.description && (
                <Text style={styles.detailDescription}>{selectedBook.description}</Text>
              )}

              <View style={styles.detailInfo}>
                <Text style={styles.detailInfoLabel}>Gênero:</Text>
                <Text style={styles.detailInfoValue}>{getGenreText(selectedBook.genre)}</Text>
              </View>

              <View style={styles.detailInfo}>
                <Text style={styles.detailInfoLabel}>Status:</Text>
                <Text style={styles.detailInfoValue}>{getStatusText(selectedBook.bookStatusId)}</Text>
              </View>

              {selectedBook.bookStatusId === 1 && (
                <TouchableOpacity
                  style={styles.requestButton}
                  onPress={() => handleRequestLoan(selectedBook)}
                >
                  <Text style={styles.requestButtonText}>📚 Solicitar Empréstimo</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
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
          <Text style={styles.headerTitle}>Perfil do Usuário</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Informações do Usuário */}
          <View style={styles.userSection}>
            <View style={styles.userAvatar}>
              {user.image ? (
                <Image source={{ uri: user.image }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
            
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            
            {user.birthDay && (
              <Text style={styles.userInfo}>
                📅 Nascido em {formatDate(user.birthDay)}
              </Text>
            )}
            
            <Text style={styles.userInfo}>
              📅 Membro desde {formatDate(user.createdAt || '')}
            </Text>

            {/* Botão de Contato */}
            {!isMyProfile && (
              <TouchableOpacity
                style={styles.contactButton}
                onPress={handleContactUser}
                activeOpacity={0.7}
              >
                <Text style={styles.contactButtonText}>📧 Entrar em Contato</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Estatísticas */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>📊 Estatísticas</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{userBooks.length}</Text>
                <Text style={styles.statLabel}>Total de Livros</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{availableBooks.length}</Text>
                <Text style={styles.statLabel}>Disponíveis</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{lentBooks.length}</Text>
                <Text style={styles.statLabel}>Disponibilizados</Text>
              </View>
            </View>
          </View>

          {/* Organizações do Usuário */}
          {isMyProfile && (
            <UserOrganizationsSection
              organizations={userOrganizations}
              getNextMeetingInfo={getNextMeetingInfo}
              onViewOrganization={onViewOrganization}
            />
          )}

          {/* Livros Disponíveis */}
          {availableBooks.length > 0 && (
            <View style={styles.booksSection}>
              <Text style={styles.sectionTitle}>
                📚 Livros Disponíveis ({availableBooks.length})
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.booksScroll}
              >
                {availableBooks.map(renderBookCard)}
              </ScrollView>
            </View>
          )}

          {/* Livros Disponibilizados */}
          {lentBooks.length > 0 && (
            <View style={styles.booksSection}>
              <Text style={styles.sectionTitle}>
                📤 Livros Disponibilizados ({lentBooks.length})
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.booksScroll}
              >
                {lentBooks.map(renderBookCard)}
              </ScrollView>
            </View>
          )}

          {/* Informações Adicionais - Controladas pela Organização */}
          {organizationSettings.showAdditionalInfo && (
            user.phone || user.address || user.additionalInfo
          ) && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>ℹ️ Informações Adicionais</Text>
              
              {organizationSettings.showPhone && user.phone && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>📞 Telefone:</Text>
                  <Text style={styles.infoValue}>{user.phone}</Text>
                </View>
              )}
              
              {organizationSettings.showAddress && user.address && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>📍 Endereço:</Text>
                  <Text style={styles.infoValue}>{user.address}</Text>
                </View>
              )}
              
              {organizationSettings.showPersonalInfo && user.additionalInfo && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>📝 Sobre:</Text>
                  <Text style={styles.infoValue}>{user.additionalInfo}</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Modal de Detalhes do Livro */}
        {renderBookDetail()}
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
  userSection: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.gray[50],
  },
  userAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarText: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
  },
  userName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  userInfo: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  contactButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.md,
  },
  contactButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  statsSection: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SPACING.xs,
    ...SHADOWS.small,
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
  booksSection: {
    padding: SPACING.lg,
  },
  booksScroll: {
    paddingRight: SPACING.lg,
  },
  bookCard: {
    width: 160,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginRight: SPACING.md,
    ...SHADOWS.small,
  },
  bookImageContainer: {
    width: 60,
    height: 80,
    backgroundColor: COLORS.gray[200],
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  bookImage: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.sm,
  },
  bookImagePlaceholder: {
    fontSize: FONT_SIZES.lg,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  bookAuthor: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  bookGenre: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  infoSection: {
    padding: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.secondary,
    width: 80,
    marginRight: SPACING.sm,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  bookDetailModal: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
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
    flex: 1,
  },
  modalContent: {
    padding: SPACING.lg,
  },
  bookDetailImage: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  detailImage: {
    width: 120,
    height: 160,
    borderRadius: BORDER_RADIUS.md,
  },
  detailImagePlaceholder: {
    width: 120,
    height: 160,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailImageText: {
    fontSize: 48,
  },
  detailAuthor: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  detailDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    lineHeight: 24,
    marginBottom: SPACING.md,
  },
  detailInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  detailInfoLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.secondary,
  },
  detailInfoValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
  },
  requestButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  requestButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
}); 