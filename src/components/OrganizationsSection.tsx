import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';
import { FoldableCard } from './FoldableCard';
import { NextMeetingCard } from './NextMeetingCard';

interface Organization {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  role: 'Admin' | 'Leader' | 'Member';
  isActive: boolean;
}

interface OrganizationsSectionProps {
  organizations: Organization[];
  onViewOrganization: (org: Organization) => void;
  onCreateOrganization: () => void;
  getNextMeetingInfo?: (organizationId: number) => any;
}

export const OrganizationsSection: React.FC<OrganizationsSectionProps> = ({
  organizations,
  onViewOrganization,
  onCreateOrganization,
  getNextMeetingInfo,
}) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return COLORS.error;
      case 'Leader':
        return COLORS.warning;
      case 'Member':
        return COLORS.success;
      default:
        return COLORS.gray[500];
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return '👑';
      case 'Leader':
        return '⭐';
      case 'Member':
        return '👤';
      default:
        return '👤';
    }
  };

  const renderOrganizations = () => {
    if (organizations.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🏢</Text>
          <Text style={styles.emptyTitle}>Nenhuma organização</Text>
          <Text style={styles.emptyText}>
            Você ainda não participa de nenhuma organização
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={onCreateOrganization}
            activeOpacity={0.7}
          >
            <Text style={styles.emptyButtonText}>Criar Organização</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.organizationsContent}>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={onCreateOrganization}
            activeOpacity={0.7}
          >
            <Text style={styles.createButtonText}>+ Nova Organização</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {organizations.map((org) => (
            <TouchableOpacity
              key={org.id}
              style={[styles.orgCard, !org.isActive && styles.inactiveOrg]}
              onPress={() => onViewOrganization(org)}
              activeOpacity={0.7}
            >
              <View style={styles.orgHeader}>
                <View style={styles.orgIcon}>
                  <Text style={styles.orgIconText}>🏢</Text>
                </View>
                <View style={styles.orgInfo}>
                  <Text style={styles.orgName}>{org.name}</Text>
                  <View style={styles.orgMeta}>
                    <Text style={styles.orgMembers}>
                      {org.memberCount} membros
                    </Text>
                    <View style={[styles.roleBadge, { backgroundColor: getRoleColor(org.role) }]}>
                      <Text style={styles.roleIcon}>{getRoleIcon(org.role)}</Text>
                      <Text style={styles.roleText}>{org.role}</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <Text style={styles.orgDescription} numberOfLines={2}>
                {org.description}
              </Text>

              {/* Card de próxima reunião */}
              {getNextMeetingInfo && (
                <View style={styles.meetingCardContainer}>
                  <NextMeetingCard
                    organizationId={org.id}
                    nextMeetingInfo={getNextMeetingInfo(org.id)}
                    onPress={() => onViewOrganization(org)}
                  />
                </View>
              )}

              {!org.isActive && (
                <View style={styles.inactiveBadge}>
                  <Text style={styles.inactiveText}>Inativa</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <FoldableCard
      title="Organizações"
      subtitle={`${organizations.length} organização${organizations.length !== 1 ? 's' : ''}`}
      icon="🏢"
      headerColor={COLORS.secondary}
      showBadge={organizations.length > 0}
      badgeText={`${organizations.length}`}
      badgeColor={COLORS.secondary}
      initiallyExpanded={false}
    >
      {renderOrganizations()}
    </FoldableCard>
  );
};

const styles = StyleSheet.create({
  organizationsContent: {
    paddingTop: SPACING.md,
  },
  headerActions: {
    marginBottom: SPACING.md,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignSelf: 'flex-start',
  },
  createButtonText: {
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
  scrollContent: {
    paddingRight: SPACING.lg,
  },
  orgCard: {
    width: 280,
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  inactiveOrg: {
    opacity: 0.6,
  },
  orgHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  orgIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  orgIconText: {
    fontSize: FONT_SIZES.lg,
  },
  orgInfo: {
    flex: 1,
  },
  orgName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  orgMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orgMembers: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  roleIcon: {
    fontSize: FONT_SIZES.sm,
    marginRight: SPACING.xs,
  },
  roleText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  orgDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    lineHeight: 18,
  },
  inactiveBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.gray[400],
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  inactiveText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  meetingCardContainer: {
    marginTop: SPACING.sm,
  },
}); 