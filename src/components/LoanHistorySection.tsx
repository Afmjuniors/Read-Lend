import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';
import { FoldableCard } from './FoldableCard';

interface LoanHistory {
  id: number;
  bookName: string;
  bookAuthor: string;
  borrowerName: string;
  lenderName: string;
  loanDate: string;
  returnDate: string;
  status: 'Active' | 'Returned' | 'Overdue' | 'Cancelled';
  isLent: boolean; // true = emprestou, false = pegou emprestado
}

interface LoanHistorySectionProps {
  loanHistory: LoanHistory[];
  onViewLoan: (loan: LoanHistory) => void;
}

export const LoanHistorySection: React.FC<LoanHistorySectionProps> = ({
  loanHistory,
  onViewLoan,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'lent' | 'borrowed'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return COLORS.info;
      case 'Returned':
        return COLORS.success;
      case 'Overdue':
        return COLORS.error;
      case 'Cancelled':
        return COLORS.gray[500];
      default:
        return COLORS.gray[500];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return '📖';
      case 'Returned':
        return '✅';
      case 'Overdue':
        return '⚠️';
      case 'Cancelled':
        return '❌';
      default:
        return '📚';
    }
  };

  const getFilteredHistory = () => {
    switch (activeFilter) {
      case 'lent':
        return loanHistory.filter(loan => loan.isLent);
      case 'borrowed':
        return loanHistory.filter(loan => !loan.isLent);
      default:
        return loanHistory;
    }
  };

  const renderLoanItem = ({ item }: { item: LoanHistory }) => (
    <TouchableOpacity
      style={styles.loanItem}
      onPress={() => onViewLoan(item)}
      activeOpacity={0.7}
    >
      <View style={styles.loanHeader}>
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={1}>
            {item.bookName}
          </Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            por {item.bookAuthor}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.loanDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>
            {item.isLent ? 'Emprestado para:' : 'Emprestado de:'}
          </Text>
          <Text style={styles.detailValue}>
            {item.isLent ? item.borrowerName : item.lenderName}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Data do empréstimo:</Text>
          <Text style={styles.detailValue}>
            {new Date(item.loanDate).toLocaleDateString('pt-BR')}
          </Text>
        </View>

        {item.returnDate && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Data de retorno:</Text>
            <Text style={styles.detailValue}>
              {new Date(item.returnDate).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        )}

        {item.status === 'Overdue' && (
          <View style={styles.overdueWarning}>
            <Text style={styles.overdueText}>⚠️ Em atraso</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const filteredHistory = getFilteredHistory();

  const renderHistoryContent = () => {
    if (filteredHistory.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>Nenhum empréstimo encontrado</Text>
          <Text style={styles.emptyText}>
            {activeFilter === 'all' 
              ? 'Você ainda não tem histórico de empréstimos'
              : activeFilter === 'lent'
              ? 'Você ainda não emprestou nenhum livro'
              : 'Você ainda não pegou nenhum livro emprestado'
            }
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.historyContent}>
        {/* Filtros */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'all' && styles.activeFilter]}
            onPress={() => setActiveFilter('all')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'lent' && styles.activeFilter]}
            onPress={() => setActiveFilter('lent')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeFilter === 'lent' && styles.activeFilterText]}>
              Disponibilizados
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'borrowed' && styles.activeFilter]}
            onPress={() => setActiveFilter('borrowed')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeFilter === 'borrowed' && styles.activeFilterText]}>
              Pegos
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredHistory}
          renderItem={renderLoanItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    );
  };

  return (
    <FoldableCard
      title="Histórico de Empréstimos"
      subtitle={`${filteredHistory.length} empréstimo${filteredHistory.length !== 1 ? 's' : ''}`}
      icon="📋"
      headerColor={COLORS.warning}
      showBadge={loanHistory.length > 0}
      badgeText={`${loanHistory.length}`}
      badgeColor={COLORS.warning}
      initiallyExpanded={false}
    >
      {renderHistoryContent()}
    </FoldableCard>
  );
};

const styles = StyleSheet.create({
  historyContent: {
    paddingTop: SPACING.md,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
  },
  filterButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  filterText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  activeFilterText: {
    color: COLORS.primary,
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
  },
  listContainer: {
    paddingBottom: SPACING.md,
  },
  loanItem: {
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  bookInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  bookTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  bookAuthor: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
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
  loanDetails: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    paddingTop: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  detailLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  detailValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.primary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  overdueWarning: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
    marginTop: SPACING.xs,
  },
  overdueText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },
}); 