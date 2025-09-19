import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useOrganizations } from '../hooks/useOrganizations';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

// Exemplo de como usar os métodos de previsão de reunião
export const MeetingPredictionExample: React.FC = () => {
  const { getNextMeeting, getNextMeetingFormatted, getNextMeetingInfo } = useOrganizations();

  // Exemplo de uso dos métodos
  const organizationId = 1; // ID da organização
  
  const nextMeeting = getNextMeeting(organizationId);
  const formattedMeeting = getNextMeetingFormatted(organizationId);
  const meetingInfo = getNextMeetingInfo(organizationId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exemplo de Previsão de Reuniões</Text>
      
      {/* Método 1: getNextMeeting - Retorna apenas a data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. getNextMeeting()</Text>
        <Text style={styles.result}>
          {nextMeeting ? nextMeeting.toLocaleDateString('pt-BR') : 'Nenhuma reunião programada'}
        </Text>
      </View>

      {/* Método 2: getNextMeetingFormatted - Retorna data formatada */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. getNextMeetingFormatted()</Text>
        <Text style={styles.result}>{formattedMeeting.formatted}</Text>
        <Text style={styles.detail}>{formattedMeeting.detail}</Text>
      </View>

      {/* Método 3: getNextMeetingInfo - Retorna informações completas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. getNextMeetingInfo()</Text>
        {meetingInfo && (
          <View>
            <Text style={styles.result}>{meetingInfo.message}</Text>
            <Text style={styles.detail}>{meetingInfo.detail}</Text>
            <Text style={styles.detail}>🕐 {meetingInfo.time}</Text>
            {meetingInfo.daysUntil !== null && (
              <Text style={styles.detail}>
                {meetingInfo.isToday ? '🔥 Hoje!' : 
                 meetingInfo.isTomorrow ? '⏰ Amanhã' : 
                 `📅 Em ${meetingInfo.daysUntil} dias`}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    margin: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    marginBottom: SPACING.lg,
    color: COLORS.text.primary,
  },
  section: {
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.gray[50],
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'semibold',
    marginBottom: SPACING.sm,
    color: COLORS.text.primary,
  },
  result: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  detail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
});
