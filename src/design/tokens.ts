/**
 * Single source of truth for the visual language.
 *
 * Nothing in the product may hardcode a colour, radius, spacing step or duration. Web reads
 * these through generated CSS variables, Android through a generated Compose theme, so a
 * change here lands in every interface at once.
 *
 * Colours are stored as HSL channel triples ("H S% L%") so both targets can compose them
 * with their own alpha handling.
 */

export interface ThemeColors {
  /** Page background, behind everything. */
  background: string;
  /** Cards, sheets, bars. */
  surface: string;
  /** Secondary surface for grouping without a border. */
  surfaceMuted: string;
  /** Surface that sits on top of the map. */
  surfaceOverlay: string;
  border: string;
  text: string;
  textMuted: string;
  /** Brand colour. Used for the primary action and the clean route line. */
  primary: string;
  primaryHover: string;
  primaryContrast: string;
  /** Warm secondary, used sparingly for highlights and the live pulse. */
  accent: string;
  accentContrast: string;
  /** Route is verified clean. */
  success: string;
  successContrast: string;
  /** Route could not be verified, or a forbidden zone. */
  danger: string;
  dangerContrast: string;
  /** Approaching a zone, or a costly detour. */
  warning: string;
  warningContrast: string;
  /**
   * Generic zone colour, kept as a fallback. Real zones are coloured by stringency layer
   * with the three tokens below.
   */
  zone: string;
  /** basic - forbidden by every opinion (איסור גמור לכו"ע). Pink. */
  zoneBasic: string;
  /** taharat - the Taharat Kohanim rabbinate ruling. Brown. */
  zoneTaharat: string;
  /** machmirim - disputed area, the stricter hold it forbidden (יש מחמירין). Orange. */
  zoneMachmirim: string;
  /** Route drawn without avoidance, debug only. */
  routeNaive: string;
  /** Focus ring. */
  focus: string;
}

const light: ThemeColors = {
  background: '210 30% 97%',
  surface: '0 0% 100%',
  surfaceMuted: '210 28% 94%',
  surfaceOverlay: '0 0% 100%',
  border: '213 22% 88%',
  text: '222 28% 13%',
  textMuted: '216 14% 44%',
  primary: '204 88% 44%',
  primaryHover: '204 88% 38%',
  primaryContrast: '0 0% 100%',
  accent: '28 94% 55%',
  accentContrast: '24 60% 14%',
  success: '156 58% 36%',
  successContrast: '0 0% 100%',
  danger: '356 72% 51%',
  dangerContrast: '0 0% 100%',
  warning: '38 94% 50%',
  warningContrast: '30 60% 14%',
  zone: '356 72% 51%',
  zoneBasic: '330 78% 56%',
  zoneTaharat: '24 46% 40%',
  zoneMachmirim: '30 92% 52%',
  routeNaive: '218 12% 55%',
  focus: '204 88% 44%',
};

const dark: ThemeColors = {
  background: '222 30% 8%',
  surface: '222 24% 12%',
  surfaceMuted: '222 20% 17%',
  surfaceOverlay: '222 24% 14%',
  border: '220 16% 24%',
  text: '210 30% 96%',
  textMuted: '215 15% 66%',
  primary: '202 90% 58%',
  primaryHover: '202 90% 66%',
  primaryContrast: '222 40% 10%',
  accent: '30 96% 62%',
  accentContrast: '24 60% 12%',
  success: '156 52% 48%',
  successContrast: '222 40% 10%',
  danger: '356 76% 62%',
  dangerContrast: '222 40% 10%',
  warning: '40 94% 60%',
  warningContrast: '30 60% 12%',
  zone: '356 76% 60%',
  zoneBasic: '330 80% 64%',
  zoneTaharat: '24 48% 52%',
  zoneMachmirim: '30 92% 60%',
  routeNaive: '218 10% 58%',
  focus: '202 90% 58%',
};

/** Rounded, but stopping well short of pill shaped. */
const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
} as const;

/** 4px grid. */
const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

/**
 * Two roles only. `ui` carries the whole interface; `nav` is reserved for the driving
 * screen, where size and weight matter more than personality.
 */
const typography = {
  fontFamily: {
    ui: "'Rubik', 'Segoe UI', 'Noto Sans Hebrew', system-ui, -apple-system, sans-serif",
    nav: "'Rubik', 'Segoe UI', 'Noto Sans Hebrew', system-ui, sans-serif",
  },
  size: {
    caption: 12,
    label: 13,
    body: 15,
    bodyLarge: 17,
    title: 20,
    heading: 26,
    display: 34,
    /** Next-manoeuvre distance on the driving screen. Readable in one glance. */
    navPrimary: 44,
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.45,
    relaxed: 1.6,
  },
} as const;

/** Soft and low contrast. Depth comes from elevation, not from heavy borders. */
const elevation = {
  none: 'none',
  sm: '0 1px 2px hsl(222 30% 10% / 0.06), 0 1px 3px hsl(222 30% 10% / 0.04)',
  md: '0 4px 12px hsl(222 30% 10% / 0.08), 0 2px 4px hsl(222 30% 10% / 0.04)',
  lg: '0 12px 32px hsl(222 30% 10% / 0.12), 0 4px 8px hsl(222 30% 10% / 0.05)',
  overlay: '0 20px 48px hsl(222 30% 10% / 0.18)',
} as const;

/** Everything moves on the same curve, so the product feels like one thing. */
const motion = {
  duration: {
    instant: 90,
    fast: 160,
    normal: 240,
    slow: 380,
  },
  easing: {
    standard: 'cubic-bezier(0.22, 1, 0.36, 1)',
    entrance: 'cubic-bezier(0.16, 1, 0.3, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
  },
} as const;

/** Minimum touch target, in dp/px. Driving means gloves and bumps. */
const touch = {
  minTarget: 48,
  comfortableTarget: 56,
} as const;

export const tokens = {
  colors: { light, dark },
  radius,
  space,
  typography,
  elevation,
  motion,
  touch,
} as const;

export type Tokens = typeof tokens;
export type ThemeMode = keyof Tokens['colors'];
