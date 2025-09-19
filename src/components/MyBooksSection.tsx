import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { Book, getGenreText, getStatusText, getStatusColor, GENRES } from '../types';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';
import { FoldableCard } from './FoldableCard';

interface MyBooksSectionProps {
  books: Book[];
  currentUserId: number; // Adicionando ID do usuário atual
  onAddBook: () => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (bookId: number) => void;
  onViewBook: (book: Book) => void;
}

export const MyBooksSection: React.FC<MyBooksSectionProps> = ({
  books,
  currentUserId,
  onAddBook,
  onEditBook,
  onDeleteBook,
  onViewBook,
}) => {
  const getBooksByStatus = () => {
    // Meus Livros - livros que eu possuo (disponíveis e disponibilizados)
    const myBooks = books.filter(book => book.ownerId === currentUserId);
    
    // Livros que Estou Lendo - livros que emprestei de outros (não sou o dono)
    const readingBooks = books.filter(book => book.ownerId !== currentUserId && book.bookStatusId === 2);
    
    // Lista de Espera - livros que solicitei emprestado (status reservado)
    const waitingList = books.filter(book => book.bookStatusId === 3);
    
    return { myBooks, readingBooks, waitingList };
  };

  const { myBooks, readingBooks, waitingList } = getBooksByStatus();

  const renderBookCard = (book: Book) => (
    <TouchableOpacity
      key={book.bookId}
      style={styles.bookCard}
      onPress={() => onViewBook(book)}
      activeOpacity={0.7}
    >
      <View style={styles.bookImageContainer}>
        <Text style={styles.bookImagePlaceholder}>📚</Text>
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

  const renderBooksContent = () => {
    if (books.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>Sua estante está vazia</Text>
          <Text style={styles.emptyText}>
            Adicione seus primeiros livros para começar a compartilhar
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={onAddBook}
            activeOpacity={0.7}
          >
            <Text style={styles.emptyButtonText}>Adicionar Primeiro Livro</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.booksContent}>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddBook}
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonText}>+ Adicionar Livro</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Meus Livros */}
          {myBooks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                📖 Meus Livros ({myBooks.length})
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {myBooks.map(renderBookCard)}
              </ScrollView>
            </View>
          )}

          {/* Livros que Estou Lendo */}
          {readingBooks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                �� Livros que Estou Lendo ({readingBooks.length})
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {readingBooks.map(renderBookCard)}
              </ScrollView>
            </View>
          )}

          {/* Lista de Espera */}
          {waitingList.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                ⏳ Lista de Espera ({waitingList.length})
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {waitingList.map(renderBookCard)}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <>
      <FoldableCard
        title="Minha Estante"
        subtitle={`${myBooks.length} meus livros • ${readingBooks.length} lendo de outros • ${waitingList.length} aguardando`}
        icon="📚"
        headerColor={COLORS.success}
        showBadge={books.length > 0}
        badgeText={`${books.length}`}
        badgeColor={COLORS.success}
        initiallyExpanded={false}
      >
        {renderBooksContent()}
      </FoldableCard>
    </>
  );
};

const styles = StyleSheet.create({
  booksContent: {
    paddingTop: SPACING.md,
  },
  headerActions: {
    marginBottom: SPACING.md,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  horizontalScroll: {
    paddingRight: SPACING.lg,
  },
  bookCard: {
    width: 160,
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
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

}); 