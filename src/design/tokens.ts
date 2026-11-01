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
  /** Pale tinted band: a title strip, a notice bar, the selected row of a list. */
  band: string;
  /** Surface that sits on top of the map. */
  surfaceOverlay: string;
  /** Hairline border of cards and rows. Civic separates with lines, not shadows. */
  border: string;
  /** Border of controls (outline buttons, inputs, unchecked switches). 3:1 on surface. */
  borderStrong: string;
  /** Headings and big numbers. */
  text: string;
  /** Running text. */
  textBody: string;
  /** Secondary text. Slate blue, never plain grey. */
  textMuted: string;
  /** Brand colour. Used for the primary action and the clean route line. */
  primary: string;
  primaryHover: string;
  primaryContrast: string;
  /** Background of a blue icon chip, a selected chip, a progress track. */
  primarySoft: string;
  /** Warm secondary, used sparingly for highlights and the live pulse. */
  accent: string;
  accentContrast: string;
  /** Route is verified clean. */
  success: string;
  successContrast: string;
  successSoft: string;
  /** Route could not be verified, or a forbidden zone. */
  danger: string;
  dangerContrast: string;
  dangerSoft: string;
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
  /** Danger zone (Oslo Area A) - a separate security axis, not halachic. Violet. */
  zoneDanger: string;
  /** Route drawn without avoidance, debug only. */
  routeNaive: string;
  /** Focus ring. */
  focus: string;
}

// Tickta Civic palette (royal blue action colour, slate secondary text, hairlines). The zone
// colours are not part of Civic and keep their meaning.
const light: ThemeColors = {
  background: '0 0% 100%',
  surface: '0 0% 100%',
  surfaceMuted: '223 78% 98%',
  band: '223 78% 98%',
  surfaceOverlay: '0 0% 100%',
  border: '219 33% 92%',
  borderStrong: '215 27% 55%',
  text: '217 34% 12%',
  textBody: '219 20% 17%',
  textMuted: '218 34% 46%',
  primary: '222 69% 52%',
  primaryHover: '222 63% 40%',
  primaryContrast: '0 0% 100%',
  primarySoft: '221 90% 96%',
  accent: '290 86% 35%',
  accentContrast: '0 0% 100%',
  success: '137 71% 22%',
  successContrast: '0 0% 100%',
  successSoft: '120 35% 93%',
  danger: '4 76% 40%',
  dangerContrast: '0 0% 100%',
  dangerSoft: '6 83% 95%',
  warning: '38 94% 50%',
  warningContrast: '30 60% 14%',
  zone: '356 72% 51%',
  zoneBasic: '330 78% 56%',
  zoneTaharat: '24 46% 40%',
  zoneMachmirim: '30 92% 52%',
  zoneDanger: '272 60% 52%',
  routeNaive: '218 12% 55%',
  focus: '222 69% 52%',
};

const dark: ThemeColors = {
  background: '219 38% 9%',
  surface: '219 38% 15%',
  surfaceMuted: '218 37% 12%',
  band: '218 37% 12%',
  surfaceOverlay: '219 38% 15%',
  border: '220 32% 22%',
  borderStrong: '217 25% 53%',
  text: '218 48% 95%',
  textBody: '218 29% 87%',
  textMuted: '218 41% 73%',
  primary: '222 83% 69%',
  primaryHover: '222 83% 79%',
  primaryContrast: '219 38% 9%',
  primarySoft: '221 47% 20%',
  accent: '290 62% 72%',
  accentContrast: '219 38% 9%',
  success: '135 49% 66%',
  successContrast: '219 38% 9%',
  successSoft: '138 39% 14%',
  danger: '4 92% 69%',
  dangerContrast: '219 38% 9%',
  dangerSoft: '3 51% 15%',
  warning: '40 94% 60%',
  warningContrast: '30 60% 12%',
  zone: '356 76% 60%',
  zoneBasic: '330 80% 64%',
  zoneTaharat: '24 48% 52%',
  zoneMachmirim: '30 92% 60%',
  zoneDanger: '272 66% 64%',
  routeNaive: '218 10% 58%',
  focus: '222 83% 69%',
};

/** Civic radii: inputs 10, notice bars and tables 12, cards 16. Buttons and chips are pills. */
const radius = {
  xs: 6,
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
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
    ui: "'Noto Sans Hebrew', 'Noto Sans', 'Segoe UI', Arial, system-ui, sans-serif",
    nav: "'Noto Sans Hebrew', 'Noto Sans', 'Segoe UI', Arial, system-ui, sans-serif",
  },
  size: {
    caption: 12,
    label: 14,
    body: 16,
    bodyLarge: 18,
    title: 21,
    heading: 24,
    display: 32,
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

/**
 * Civic separates surfaces with hairlines, not shadows. Only what floats over the busy map
 * keeps a faint lift (lg), and dialogs keep a soft overlay shadow.
 */
const elevation = {
  none: 'none',
  sm: 'none',
  md: 'none',
  lg: '0 2px 8px hsl(219 38% 9% / 0.10)',
  overlay: '0 12px 32px hsl(219 38% 9% / 0.16)',
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
