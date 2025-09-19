import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';

interface QuickLoan {
  id: number;
  bookId: number;
  bookTitle: string;
  bookImage?: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowedAt: string;
  dueDate: string;
  isOverdue: boolean;
}

interface QuickReturn {
  id: number;
  bookId: number;
  bookTitle: string;
  bookImage?: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowedAt: string;
  dueDate: string;
  isOverdue: boolean;
}

interface QuickActionsProps {
  loans: QuickLoan[];
  returns: QuickReturn[];
  onMarkAsLoaned: (bookId: number, borrowerEmail: string) => void;
  onMarkAsReturned: (bookId: number) => void;
  onContactBorrower: (email: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  loans,
  returns,
  onMarkAsLoaned,
  onMarkAsReturned,
  onContactBorrower,
}) => {
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<QuickLoan | null>(null);
  const [borrowerEmail, setBorrowerEmail] = useState('');

  const handleMarkAsLoaned = (book: QuickLoan) => {
    setSelectedBook(book);
    setShowLoanModal(true);
  };

  const handleConfirmLoan = () => {
    if (!borrowerEmail.trim()) {
      Alert.alert('Erro', 'Por favor, insira o email do usuário');
      return;
    }
    if (!selectedBook) return;
    
    onMarkAsLoaned(selectedBook.bookId, borrowerEmail.trim());
    setShowLoanModal(false);
    setSelectedBook(null);
    setBorrowerEmail('');
  };

  const handleMarkAsReturned = (book: QuickReturn) => {
    Alert.alert(
      'Confirmar Devolução',
      `Confirmar que "${book.bookTitle}" foi devolvido?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => onMarkAsReturned(book.bookId),
        },
      ]
    );
  };

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚡ Atualização Rápida</Text>
      
      <ScrollView style={styles.content}>
        {/* Seção de Empréstimos Pendentes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Empréstimos Pendentes</Text>
          {loans.length === 0 ? (
            <Text style={styles.emptyMessage}>Nenhum empréstimo pendente</Text>
          ) : (
            loans.map((loan) => (
              <View key={loan.id} style={styles.loanCard}>
                <View style={styles.loanHeader}>
                  <Text style={styles.bookTitle}>{loan.bookTitle}</Text>
                  <Text style={styles.borrowerName}>{loan.borrowerName}</Text>
                </View>
                <View style={styles.loanDetails}>
                  <Text style={styles.loanDate}>
                    Emprestado em: {new Date(loan.borrowedAt).toLocaleDateString('pt-BR')}
                  </Text>
                  <Text style={styles.dueDate}>
                    Vencimento: {new Date(loan.dueDate).toLocaleDateString('pt-BR')}
                  </Text>
                  {loan.isOverdue ? (
                    <Text style={styles.overdueText}>
                      Atrasado há {Math.abs(getDaysOverdue(loan.dueDate))} dias
                    </Text>
                  ) : (
                    <Text style={styles.remainingText}>
                      {getDaysRemaining(loan.dueDate)} dias restantes
                    </Text>
                  )}
                </View>
                <View style={styles.loanActions}>
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => onContactBorrower(loan.borrowerEmail)}
                  >
                    <Text style={styles.contactButtonText}>Contatar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.loanButton}
                    onPress={() => handleMarkAsLoaned(loan)}
                  >
                    <Text style={styles.loanButtonText}>Marcar como Emprestado</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Seção de Devoluções */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📖 Devoluções</Text>
          {returns.length === 0 ? (
            <Text style={styles.emptyMessage}>Nenhuma devolução pendente</Text>
          ) : (
            returns.map((returnItem) => (
              <View key={returnItem.id} style={styles.returnCard}>
                <View style={styles.returnHeader}>
                  <Text style={styles.bookTitle}>{returnItem.bookTitle}</Text>
                  <Text style={styles.borrowerName}>{returnItem.borrowerName}</Text>
                </View>
                <View style={styles.returnDetails}>
                  <Text style={styles.returnDate}>
                    Emprestado em: {new Date(returnItem.borrowedAt).toLocaleDateString('pt-BR')}
                  </Text>
                  <Text style={styles.dueDate}>
                    Vencimento: {new Date(returnItem.dueDate).toLocaleDateString('pt-BR')}
                  </Text>
                  {returnItem.isOverdue && (
                    <Text style={styles.overdueText}>
                      Atrasado há {Math.abs(getDaysOverdue(returnItem.dueDate))} dias
                    </Text>
                  )}
                </View>
                <View style={styles.returnActions}>
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => onContactBorrower(returnItem.borrowerEmail)}
                  >
                    <Text style={styles.contactButtonText}>Contatar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.returnButton}
                    onPress={() => handleMarkAsReturned(returnItem)}
                  >
                    <Text style={styles.returnButtonText}>Marcar como Devolvido</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal para confirmar empréstimo */}
      <Modal
        visible={showLoanModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLoanModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Empréstimo</Text>
            {selectedBook && (
              <Text style={styles.modalBookTitle}>{selectedBook.bookTitle}</Text>
            )}
            <Text style={styles.modalLabel}>Email do usuário:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Digite o email do usuário"
              value={borrowerEmail}
              onChangeText={setBorrowerEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowLoanModal(false);
                  setSelectedBook(null);
                  setBorrowerEmail('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleConfirmLoan}
              >
                <Text style={styles.modalConfirmText}>Confirmar</Text>
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
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    padding: SPACING.lg,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
    padding: SPACING.lg,
  },
  loanCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.small,
  },
  loanHeader: {
    marginBottom: SPACING.sm,
  },
  bookTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  borrowerName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  loanDetails: {
    marginBottom: SPACING.md,
  },
  loanDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  dueDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  overdueText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  remainingText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
  },
  loanActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  contactButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  loanButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  loanButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  returnCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.small,
  },
  returnHeader: {
    marginBottom: SPACING.sm,
  },
  returnDetails: {
    marginBottom: SPACING.md,
  },
  returnDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  returnActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  returnButton: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  returnButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    margin: SPACING.xl,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.large,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  modalBookTitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
  },
  modalLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    backgroundColor: COLORS.white,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  modalCancelText: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZES.md,
  },
  modalConfirmButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  modalConfirmText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
}); 