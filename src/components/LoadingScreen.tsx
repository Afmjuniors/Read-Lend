import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Carregando...' 
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  message: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text.secondary,
  },
}); 