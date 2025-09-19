import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';

export const theme = {
  colors: COLORS,
  spacing: SPACING,
  fontSizes: FONT_SIZES,
  fontWeights: FONT_WEIGHTS,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
};

export type Theme = typeof theme; 