import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';

interface WaitingListEntry {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  requestedAt: string;
  priority: number;
  estimatedWaitTime?: string;
}

interface WaitingListProps {
  bookId: number;
  bookTitle: string;
  entries: WaitingListEntry[];
  currentUserPosition?: number;
  onJoinWaitingList: () => void;
  onLeaveWaitingList: () => void;
  onContactUser: (userId: number) => void;
  onClose: () => void;
}

export const WaitingList: React.FC<WaitingListProps> = ({
  bookId,
  bookTitle,
  entries,
  currentUserPosition,
  onJoinWaitingList,
  onLeaveWaitingList,
  onContactUser,
  onClose,
}) => {
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleJoinList = () => {
    Alert.alert(
      'Entrar na Fila',
      'Tem certeza que deseja entrar na fila de espera para este livro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Entrar',
          onPress: () => {
            onJoinWaitingList();
            setShowJoinModal(false);
          },
        },
      ]
    );
  };

  const handleLeaveList = () => {
    Alert.alert(
      'Sair da Fila',
      'Tem certeza que deseja sair da fila de espera?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: onLeaveWaitingList,
        },
      ]
    );
  };

  const getEstimatedWaitTime = (position: number) => {
    // Estimativa baseada na posição (assumindo 2 semanas por pessoa)
    const weeks = position * 2;
    if (weeks === 0) return 'Disponível agora';
    if (weeks === 1) return '~1 semana';
    if (weeks < 4) return `~${weeks} semanas`;
    const months = Math.ceil(weeks / 4);
    return `~${months} ${months === 1 ? 'mês' : 'meses'}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fila de Espera</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{bookTitle}</Text>
        <Text style={styles.totalWaiting}>{entries.length} pessoa(s) na fila</Text>
      </View>

      {currentUserPosition ? (
        <View style={styles.userPosition}>
          <Text style={styles.positionTitle}>Sua Posição</Text>
          <Text style={styles.positionNumber}>#{currentUserPosition}</Text>
          <Text style={styles.estimatedTime}>
            {getEstimatedWaitTime(currentUserPosition)}
          </Text>
          <TouchableOpacity
            style={styles.leaveButton}
            onPress={handleLeaveList}
          >
            <Text style={styles.leaveButtonText}>Sair da Fila</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => setShowJoinModal(true)}
        >
          <Text style={styles.joinButtonText}>Entrar na Fila</Text>
        </TouchableOpacity>
      )}

      <ScrollView style={styles.entriesList}>
        <Text style={styles.sectionTitle}>Lista de Espera</Text>
        {entries.map((entry, index) => (
          <View key={entry.id} style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <View style={styles.positionContainer}>
                <Text style={styles.position}>#{index + 1}</Text>
                {entry.userId === 1 && (
                  <Text style={styles.currentUser}>Você</Text>
                )}
              </View>
              <Text style={styles.waitingSince}>
                Desde {new Date(entry.requestedAt).toLocaleDateString('pt-BR')}
              </Text>
            </View>
            <Text style={styles.userName}>{entry.userName}</Text>
            <Text style={styles.estimatedWait}>
              {getEstimatedWaitTime(index + 1)}
            </Text>
            {entry.userId !== 1 && (
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => onContactUser(entry.userId)}
              >
                <Text style={styles.contactButtonText}>Contatar</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        {entries.length === 0 && (
          <Text style={styles.noEntries}>
            Nenhuma pessoa na fila. O livro está disponível!
          </Text>
        )}
      </ScrollView>

      <Modal
        visible={showJoinModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowJoinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Entrar na Fila</Text>
            <Text style={styles.modalMessage}>
              Você será adicionado à fila de espera para "{bookTitle}". 
              Você será notificado quando for sua vez.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowJoinModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleJoinList}
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
  bookInfo: {
    backgroundColor: COLORS.white,
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.small,
  },
  bookTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  totalWaiting: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
  userPosition: {
    backgroundColor: COLORS.primary,
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  positionTitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    opacity: 0.9,
  },
  positionNumber: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
    marginVertical: SPACING.sm,
  },
  estimatedTime: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SPACING.md,
  },
  leaveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  leaveButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  joinButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  entriesList: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  entryCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.small,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  positionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  position: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    marginRight: SPACING.sm,
  },
  currentUser: {
    fontSize: FONT_SIZES.sm,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  waitingSince: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  userName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  estimatedWait: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  contactButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignSelf: 'flex-start',
  },
  contactButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  noEntries: {
    textAlign: 'center',
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
    marginTop: SPACING.xl,
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
  modalMessage: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    lineHeight: 20,
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