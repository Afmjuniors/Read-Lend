import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';

interface PublicBook {
  id: number;
  title: string;
  author: string;
  genre: string;
  image?: string;
  ownerName: string;
  ownerEmail: string;
  isAvailable: boolean;
  waitingListCount: number;
  averageRating: number;
  reviewCount: number;
}

interface OrganizationPublicLibraryProps {
  organizationId: number;
  organizationName: string;
  books: PublicBook[];
  onRequestBook: (bookId: number) => void;
  onContactOwner: (email: string) => void;
  onViewBookDetails: (bookId: number) => void;
  onViewReviews: (bookId: number) => void;
  onViewWaitingList: (bookId: number) => void;
}

export const OrganizationPublicLibrary: React.FC<OrganizationPublicLibraryProps> = ({
  organizationId,
  organizationName,
  books,
  onRequestBook,
  onContactOwner,
  onViewBookDetails,
  onViewReviews,
  onViewWaitingList,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'rating' | 'waiting'>('title');

  const genres = ['all', 'fiction', 'non-fiction', 'science', 'history', 'biography', 'romance', 'thriller'];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return a.author.localeCompare(b.author);
      case 'rating':
        return b.averageRating - a.averageRating;
      case 'waiting':
        return b.waitingListCount - a.waitingListCount;
      default:
        return 0;
    }
  });

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Text key={star} style={[styles.star, star <= rating && styles.starFilled]}>
            {star <= rating ? '★' : '☆'}
          </Text>
        ))}
      </View>
    );
  };

  const handleRequestBook = (book: PublicBook) => {
    if (!book.isAvailable) {
      Alert.alert(
        'Livro Indisponível',
        'Este livro não está disponível no momento. Deseja entrar na fila de espera?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Entrar na Fila', onPress: () => onRequestBook(book.id) },
        ]
      );
    } else {
      Alert.alert(
        'Solicitar Livro',
        `Deseja solicitar "${book.title}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Solicitar', onPress: () => onRequestBook(book.id) },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📚 Biblioteca Pública</Text>
        <Text style={styles.subtitle}>{organizationName}</Text>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar livros..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genreFilters}>
          {genres.map((genre) => (
            <TouchableOpacity
              key={genre}
              style={[styles.genreChip, selectedGenre === genre && styles.genreChipActive]}
              onPress={() => setSelectedGenre(genre)}
            >
              <Text style={[styles.genreChipText, selectedGenre === genre && styles.genreChipTextActive]}>
                {genre === 'all' ? 'Todos' : genre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Ordenar por:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.sortChip, sortBy === 'title' && styles.sortChipActive]}
              onPress={() => setSortBy('title')}
            >
              <Text style={[styles.sortChipText, sortBy === 'title' && styles.sortChipTextActive]}>
                Título
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortChip, sortBy === 'author' && styles.sortChipActive]}
              onPress={() => setSortBy('author')}
            >
              <Text style={[styles.sortChipText, sortBy === 'author' && styles.sortChipTextActive]}>
                Autor
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortChip, sortBy === 'rating' && styles.sortChipActive]}
              onPress={() => setSortBy('rating')}
            >
              <Text style={[styles.sortChipText, sortBy === 'rating' && styles.sortChipTextActive]}>
                Avaliação
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortChip, sortBy === 'waiting' && styles.sortChipActive]}
              onPress={() => setSortBy('waiting')}
            >
              <Text style={[styles.sortChipText, sortBy === 'waiting' && styles.sortChipTextActive]}>
                Fila
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* Lista de Livros */}
      <ScrollView style={styles.booksList}>
        {sortedBooks.length === 0 ? (
          <Text style={styles.emptyMessage}>
            Nenhum livro encontrado com os filtros selecionados.
          </Text>
        ) : (
          sortedBooks.map((book) => (
            <View key={book.id} style={styles.bookCard}>
              <View style={styles.bookHeader}>
                <View style={styles.bookImageContainer}>
                  {book.image ? (
                    <Image source={{ uri: book.image }} style={styles.bookImage} />
                  ) : (
                    <Text style={styles.bookImagePlaceholder}>📖</Text>
                  )}
                </View>
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.bookAuthor}>{book.author}</Text>
                  <Text style={styles.bookGenre}>{book.genre}</Text>
                  <Text style={styles.bookOwner}>Dono: {book.ownerName}</Text>
                </View>
                <View style={styles.bookStatus}>
                  <View style={[styles.statusBadge, book.isAvailable ? styles.availableBadge : styles.unavailableBadge]}>
                    <Text style={[styles.statusText, book.isAvailable ? styles.availableText : styles.unavailableText]}>
                      {book.isAvailable ? 'Disponível' : 'Indisponível'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.bookDetails}>
                <View style={styles.ratingContainer}>
                  {renderStars(book.averageRating)}
                  <Text style={styles.ratingText}>
                    {book.averageRating.toFixed(1)} ({book.reviewCount} avaliações)
                  </Text>
                </View>

                {book.waitingListCount > 0 && (
                  <View style={styles.waitingContainer}>
                    <Text style={styles.waitingText}>
                      {book.waitingListCount} pessoa(s) na fila
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.bookActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onViewBookDetails(book.id)}
                >
                  <Text style={styles.actionButtonText}>Detalhes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onViewReviews(book.id)}
                >
                  <Text style={styles.actionButtonText}>Avaliações</Text>
                </TouchableOpacity>

                {book.waitingListCount > 0 && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onViewWaitingList(book.id)}
                  >
                    <Text style={styles.actionButtonText}>Fila</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onContactOwner(book.ownerEmail)}
                >
                  <Text style={styles.actionButtonText}>Contatar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.requestButton, !book.isAvailable && styles.requestButtonDisabled]}
                  onPress={() => handleRequestBook(book)}
                  disabled={!book.isAvailable && book.waitingListCount === 0}
                >
                  <Text style={styles.requestButtonText}>
                    {book.isAvailable ? 'Solicitar' : 'Entrar na Fila'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
  filtersContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    backgroundColor: COLORS.white,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  genreFilters: {
    marginBottom: SPACING.md,
  },
  genreChip: {
    backgroundColor: COLORS.gray[100],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.sm,
  },
  genreChipActive: {
    backgroundColor: COLORS.primary,
  },
  genreChipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  genreChipTextActive: {
    color: COLORS.white,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginRight: SPACING.md,
  },
  sortChip: {
    backgroundColor: COLORS.gray[100],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.sm,
  },
  sortChipActive: {
    backgroundColor: COLORS.secondary,
  },
  sortChipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  sortChipTextActive: {
    color: COLORS.white,
  },
  booksList: {
    flex: 1,
    padding: SPACING.lg,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
    marginTop: SPACING.xl,
  },
  bookCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.small,
  },
  bookHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  bookImageContainer: {
    width: 60,
    height: 80,
    backgroundColor: COLORS.gray[200],
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  bookImage: {
    width: 60,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
  },
  bookImagePlaceholder: {
    fontSize: FONT_SIZES.xl,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  bookAuthor: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  bookGenre: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  bookOwner: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  bookStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  availableBadge: {
    backgroundColor: COLORS.success,
  },
  unavailableBadge: {
    backgroundColor: COLORS.error,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  availableText: {
    color: COLORS.white,
  },
  unavailableText: {
    color: COLORS.white,
  },
  bookDetails: {
    marginBottom: SPACING.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: SPACING.sm,
  },
  star: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[300],
    marginHorizontal: 1,
  },
  starFilled: {
    color: COLORS.warning,
  },
  ratingText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  waitingContainer: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  waitingText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  bookActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: COLORS.gray[100],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    minWidth: 80,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.primary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  requestButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    minWidth: 100,
    alignItems: 'center',
  },
  requestButtonDisabled: {
    backgroundColor: COLORS.gray[400],
  },
  requestButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    fontWeight: FONT_WEIGHTS.semibold,
  },
}); 