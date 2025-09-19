import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';

interface NextMeetingCardProps {
  organizationId: number;
  nextMeetingInfo: {
    hasMeeting: boolean;
    message: string;
    date: Date | null;
    formatted: string;
    detail: string;
    daysUntil: number | null;
    isToday: boolean;
    isTomorrow: boolean;
    time: string;
  } | null;
  onPress?: () => void;
}

export const NextMeetingCard: React.FC<NextMeetingCardProps> = ({
  organizationId,
  nextMeetingInfo,
  onPress,
}) => {
  if (!nextMeetingInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar informações da reunião</Text>
      </View>
    );
  }

  if (!nextMeetingInfo.hasMeeting) {
    return (
      <View style={[styles.container, styles.noMeetingContainer]}>
        <Text style={styles.noMeetingIcon}>📅</Text>
        <Text style={styles.noMeetingText}>Não há reuniões programadas</Text>
      </View>
    );
  }

  const getStatusColor = () => {
    if (nextMeetingInfo.isToday) return COLORS.error;
    if (nextMeetingInfo.isTomorrow) return COLORS.warning;
    return COLORS.primary;
  };

  const getStatusIcon = () => {
    if (nextMeetingInfo.isToday) return '🔥';
    if (nextMeetingInfo.isTomorrow) return '⏰';
    return '📅';
  };

  return (
    <TouchableOpacity 
      style={[styles.container, styles.meetingContainer]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{getStatusIcon()}</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>Próxima Reunião</Text>
          <Text style={[styles.status, { color: getStatusColor() }]}>
            {nextMeetingInfo.message}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.detailText}>{nextMeetingInfo.detail}</Text>
        <Text style={styles.timeText}>🕐 {nextMeetingInfo.time}</Text>
        
        {nextMeetingInfo.daysUntil !== null && (
          <View style={styles.daysContainer}>
            <Text style={styles.daysText}>
              {nextMeetingInfo.daysUntil === 0 
                ? 'Hoje!' 
                : nextMeetingInfo.daysUntil === 1 
                  ? 'Amanhã' 
                  : `Em ${nextMeetingInfo.daysUntil} dias`
              }
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  noMeetingContainer: {
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    borderStyle: 'dashed',
  },
  noMeetingIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  noMeetingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  meetingContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    ...SHADOWS.small,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  icon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  status: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  details: {
    marginTop: SPACING.sm,
  },
  detailText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  timeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  daysContainer: {
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  daysText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.primary,
  },
  errorText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
    textAlign: 'center',
  },
});
