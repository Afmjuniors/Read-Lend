import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';

// Habilitar animações no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FoldableCardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  children: React.ReactNode;
  initiallyExpanded?: boolean;
  onToggle?: (isExpanded: boolean) => void;
  headerColor?: string;
  showBadge?: boolean;
  badgeText?: string;
  badgeColor?: string;
  // Novas props para estatísticas
  stats?: {
    label: string;
    value: string | number;
    color?: string;
  }[];
  showStats?: boolean;
}

export const FoldableCard: React.FC<FoldableCardProps> = ({
  title,
  subtitle,
  icon,
  children,
  initiallyExpanded = false,
  onToggle,
  headerColor = COLORS.primary,
  showBadge = false,
  badgeText,
  badgeColor = COLORS.warning,
  stats,
  showStats = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [rotateAnimation] = useState(new Animated.Value(initiallyExpanded ? 1 : 0));

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    
    Animated.timing(rotateAnimation, {
      toValue: newExpandedState ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    onToggle?.(newExpandedState);
  };

  const rotateIcon = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.header, { borderLeftColor: headerColor }]}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            {icon && <Text style={styles.icon}>{icon}</Text>}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          </View>
          
          <View style={styles.headerActions}>
            {showBadge && badgeText && (
              <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                <Text style={styles.badgeText}>{badgeText}</Text>
              </View>
            )}
            <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
              <Text style={styles.arrowIcon}>▼</Text>
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          {/* Estatísticas */}
          {showStats && stats && stats.length > 0 && (
            <View style={styles.statsContainer}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <Text style={[styles.statValue, { color: stat.color || COLORS.primary }]}>
                    {stat.value}
                  </Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Conteúdo principal */}
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderLeftWidth: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: FONT_SIZES.xl,
    marginRight: SPACING.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  arrowIcon: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHTS.bold,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  // Estilos para estatísticas
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
}); 