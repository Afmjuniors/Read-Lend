import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';
import { ExtendedOrganization } from '../types';
import { NextMeetingCard } from './NextMeetingCard';

interface UserOrganizationsSectionProps {
  organizations: ExtendedOrganization[];
  getNextMeetingInfo?: (organizationId: number) => any;
  onViewOrganization?: (organization: ExtendedOrganization) => void;
}

export const UserOrganizationsSection: React.FC<UserOrganizationsSectionProps> = ({
  organizations,
  getNextMeetingInfo,
  onViewOrganization,
}) => {
  const renderOrganizationCard = (org: ExtendedOrganization) => (
    <TouchableOpacity
      key={org.id}
      style={styles.organizationCard}
      onPress={() => onViewOrganization?.(org)}
      activeOpacity={0.7}
    >
      <View style={styles.organizationHeader}>
        <View style={styles.organizationImageContainer}>
          {org.image ? (
            <Image source={{ uri: org.image }} style={styles.organizationImage} />
          ) : (
            <View style={styles.organizationImagePlaceholder}>
              <Text style={styles.organizationImageText}>🏢</Text>
            </View>
          )}
        </View>
        
        <View style={styles.organizationInfo}>
          <Text style={styles.organizationName} numberOfLines={2}>
            {org.name}
          </Text>
          <Text style={styles.organizationDescription} numberOfLines={2}>
            {org.description}
          </Text>
          <View style={styles.organizationStats}>
            <Text style={styles.memberCount}>
              👥 {org.memberCount} membros
            </Text>
            <Text style={styles.createdDate}>
              📅 Criada em {new Date(org.createdAt).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        </View>
      </View>

      {/* Próxima Reunião */}
      {getNextMeetingInfo && (
        <View style={styles.meetingCardContainer}>
          <NextMeetingCard
            organizationId={org.id}
            nextMeetingInfo={getNextMeetingInfo(org.id)}
            onPress={() => onViewOrganization?.(org)}
          />
        </View>
      )}

      {/* Regras da Organização */}
      <View style={styles.rulesContainer}>
        <Text style={styles.rulesTitle}>📋 Regras</Text>
        <View style={styles.rulesList}>
          <Text style={styles.ruleItem}>
            📚 Empréstimo: {org.rules.loanDurationDays} dias
          </Text>
          <Text style={styles.ruleItem}>
            📅 Reuniões: {getMeetingFrequencyText(org.rules.meetingFrequency)}
          </Text>
          {org.rules.meetingDay && (
            <Text style={styles.ruleItem}>
              📆 Dia: {getDayText(org.rules.meetingDay)}
            </Text>
          )}
          {org.rules.meetingTime && (
            <Text style={styles.ruleItem}>
              ⏰ Horário: {org.rules.meetingTime}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (organizations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🏢</Text>
        <Text style={styles.emptyTitle}>Nenhuma Organização</Text>
        <Text style={styles.emptyDescription}>
          Você ainda não faz parte de nenhuma organização.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        🏢 Minhas Organizações ({organizations.length})
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.organizationsScroll}
      >
        {organizations.map(renderOrganizationCard)}
      </ScrollView>
    </View>
  );
};

// Funções auxiliares para formatação
const getMeetingFrequencyText = (frequency: string): string => {
  const frequencyMap: { [key: string]: string } = {
    'na': 'Não há reuniões',
    'daily': 'Diária',
    'weekly': 'Semanal',
    'biweekly': 'Quinzenal',
    'monthly': 'Mensal',
  };
  return frequencyMap[frequency] || 'Não definido';
};

const getDayText = (day: number | string): string => {
  const dayMap: { [key: number]: string } = {
    1: 'Domingo',
    2: 'Segunda-feira',
    3: 'Terça-feira',
    4: 'Quarta-feira',
    5: 'Quinta-feira',
    6: 'Sexta-feira',
    7: 'Sábado',
  };
  return dayMap[Number(day)] || 'Não definido';
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  organizationsScroll: {
    paddingRight: SPACING.lg,
  },
  organizationCard: {
    width: 320,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginRight: SPACING.md,
    ...SHADOWS.medium,
  },
  organizationHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  organizationImageContainer: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  organizationImage: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.md,
  },
  organizationImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  organizationImageText: {
    fontSize: FONT_SIZES.xl,
  },
  organizationInfo: {
    flex: 1,
  },
  organizationName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  organizationDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  organizationStats: {
    gap: SPACING.xs / 2,
  },
  memberCount: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
  },
  createdDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
  },
  meetingCardContainer: {
    marginBottom: SPACING.md,
  },
  rulesContainer: {
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
  },
  rulesTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  rulesList: {
    gap: SPACING.xs / 2,
  },
  ruleItem: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.lg,
    margin: SPACING.lg,
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
  emptyDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});
