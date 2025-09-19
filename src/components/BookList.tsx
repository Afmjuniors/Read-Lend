import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { Book, getGenreText, getStatusText, getStatusColor } from '../types';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';

interface BookListProps {
  books: Book[];
  onBookPress: (book: Book) => void;
  title?: string;
  emptyMessage?: string;
}

export const BookList: React.FC<BookListProps> = ({
  books,
  onBookPress,
  title = '📚 Livros Disponíveis',
  emptyMessage = 'Nenhum livro encontrado',
}) => {
  if (books.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title} ({books.length})
      </Text>
      <ScrollView 
        style={styles.booksList} 
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ flexGrow: 1 }}
        nestedScrollEnabled={true}
      >
        {books.map((book) => (
          <TouchableOpacity
            key={book.bookId}
            style={styles.bookCard}
            onPress={() => onBookPress(book)}
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
              <Text style={styles.bookTitle}>{book.name}</Text>
              <Text style={styles.bookAuthor}>por {book.author}</Text>
              <Text style={styles.bookGenre}>{getGenreText(book.genre)}</Text>
              <View style={styles.bookMeta}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(book.bookStatusId) }]}>
                  <Text style={styles.statusText}>{getStatusText(book.bookStatusId)}</Text>
                </View>
                <Text style={styles.ownerInfo}>de {book.ownerInfo?.name || 'Usuário'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  booksList: {
    flex: 1,
    height: '100%',
  },
  bookCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    ...SHADOWS.small,
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
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.md,
  },
  bookImagePlaceholder: {
    fontSize: FONT_SIZES.xl,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: FONT_SIZES.lg,
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
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  bookMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
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
  ownerInfo: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
}); 