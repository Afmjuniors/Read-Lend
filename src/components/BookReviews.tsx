import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';

interface Review {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface BookReviewsProps {
  bookId: number;
  reviews: Review[];
  onAddReview: (rating: number, comment: string) => void;
  onClose: () => void;
}

export const BookReviews: React.FC<BookReviewsProps> = ({
  bookId,
  reviews,
  onAddReview,
  onClose,
}) => {
  const [showAddReview, setShowAddReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmitReview = () => {
    if (rating === 0) {
      Alert.alert('Erro', 'Por favor, selecione uma avaliação');
      return;
    }
    if (comment.trim().length < 10) {
      Alert.alert('Erro', 'O comentário deve ter pelo menos 10 caracteres');
      return;
    }
    onAddReview(rating, comment);
    setShowAddReview(false);
    setRating(0);
    setComment('');
  };

  const renderStars = (rating: number, interactive = false, onPress?: (rating: number) => void) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => interactive && onPress?.(star)}
            disabled={!interactive}
          >
            <Text style={[styles.star, star <= rating && styles.starFilled]}>
              {star <= rating ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Avaliações</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        <View style={styles.ratingContainer}>
          <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
          {renderStars(Math.round(averageRating))}
          <Text style={styles.totalReviews}>{reviews.length} avaliações</Text>
        </View>
        <TouchableOpacity
          style={styles.addReviewButton}
          onPress={() => setShowAddReview(true)}
        >
          <Text style={styles.addReviewButtonText}>Avaliar</Text>
        </TouchableOpacity>
      </View>

      {showAddReview && (
        <View style={styles.addReviewForm}>
          <Text style={styles.formTitle}>Sua Avaliação</Text>
          {renderStars(rating, true, setRating)}
          <TextInput
            style={styles.commentInput}
            placeholder="Compartilhe sua experiência com este livro..."
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
          />
          <View style={styles.formButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowAddReview(false);
                setRating(0);
                setComment('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitReview}
            >
              <Text style={styles.submitButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={styles.reviewsList}>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewerName}>{review.userName}</Text>
              <Text style={styles.reviewDate}>
                {new Date(review.createdAt).toLocaleDateString('pt-BR')}
              </Text>
            </View>
            {renderStars(review.rating)}
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))}
        {reviews.length === 0 && (
          <Text style={styles.noReviews}>Nenhuma avaliação ainda. Seja o primeiro!</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  closeButtonText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text.secondary,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    margin: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.small,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  averageRating: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: SPACING.sm,
  },
  star: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.gray[300],
    marginHorizontal: 2,
  },
  starFilled: {
    color: COLORS.warning,
  },
  totalReviews: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  addReviewButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  addReviewButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  addReviewForm: {
    backgroundColor: COLORS.white,
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.small,
  },
  formTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    backgroundColor: COLORS.white,
    color: COLORS.text.primary,
    marginTop: SPACING.md,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
  },
  cancelButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  cancelButtonText: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZES.md,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  reviewsList: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.small,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  reviewerName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
  },
  reviewDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  reviewComment: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
  noReviews: {
    textAlign: 'center',
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
    marginTop: SPACING.xl,
  },
}); 