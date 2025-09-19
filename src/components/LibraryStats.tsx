import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FoldableCard } from './FoldableCard';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants';

interface LibraryStatsProps {
  stats: {
    totalBooks: number;
    totalMembers: number;
    activeLoans: number;
    monthlyLoans: number;
    totalOrganizations: number;
    availableBooks: number;
    reservedBooks: number;
    overdueBooks: number;
  };
  isExpanded?: boolean;
  onToggle?: (isExpanded: boolean) => void;
}

export const LibraryStats: React.FC<LibraryStatsProps> = ({
  stats,
  isExpanded = false,
  onToggle,
}) => {
  const mainStats = [
    { label: 'Organizações', value: stats.totalOrganizations, color: COLORS.primary },
    { label: 'Total de Livros', value: stats.totalBooks, color: COLORS.success },
    { label: 'Membros', value: stats.totalMembers, color: COLORS.info },
    { label: 'Empréstimos Ativos', value: stats.activeLoans, color: COLORS.warning },
  ];

  const detailedStats = [
    { label: 'Disponíveis', value: stats.availableBooks, color: COLORS.success },
    { label: 'Reservados', value: stats.reservedBooks, color: COLORS.info },
    { label: 'Em Atraso', value: stats.overdueBooks, color: COLORS.error },
    { label: 'Este Mês', value: stats.monthlyLoans, color: COLORS.primary },
  ];

  return (
    <FoldableCard
      title="📊 Estatísticas da Biblioteca"
      subtitle="Livros disponíveis de outros usuários"
      icon="📈"
      initiallyExpanded={isExpanded}
      onToggle={onToggle}
      headerColor={COLORS.primary}
      showStats={true}
      stats={mainStats}
    >
      <View style={styles.detailedStatsContainer}>
        <Text style={styles.detailedStatsTitle}>📋 Detalhamento</Text>
        <View style={styles.detailedStatsGrid}>
          {detailedStats.map((stat, index) => (
            <View key={index} style={styles.detailedStatItem}>
              <Text style={[styles.detailedStatValue, { color: stat.color }]}>
                {stat.value}
              </Text>
              <Text style={styles.detailedStatLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.insightsContainer}>
        <Text style={styles.insightsTitle}>💡 Insights</Text>
        <View style={styles.insightItem}>
          <Text style={styles.insightText}>
            📚 <Text style={styles.insightHighlight}>{stats.totalBooks}</Text> livros de outros usuários disponíveis
          </Text>
        </View>
        <View style={styles.insightItem}>
          <Text style={styles.insightText}>
            👥 <Text style={styles.insightHighlight}>{stats.totalMembers}</Text> membros ativos na comunidade
          </Text>
        </View>
        <View style={styles.insightItem}>
          <Text style={styles.insightText}>
            🔄 <Text style={styles.insightHighlight}>{stats.activeLoans}</Text> empréstimos em andamento
          </Text>
        </View>
        <View style={styles.insightItem}>
          <Text style={styles.insightText}>
            📅 <Text style={styles.insightHighlight}>{stats.monthlyLoans}</Text> empréstimos este mês
          </Text>
        </View>
      </View>
    </FoldableCard>
  );
};

const styles = StyleSheet.create({
  detailedStatsContainer: {
    marginTop: SPACING.md,
  },
  detailedStatsTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  detailedStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  detailedStatItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.gray[50],
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  detailedStatValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.xs,
  },
  detailedStatLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  insightsContainer: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  insightsTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  insightItem: {
    marginBottom: SPACING.sm,
  },
  insightText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  insightHighlight: {
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
}); 