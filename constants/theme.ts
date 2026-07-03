// constants/theme.ts
// Single source of truth for every color, radius, and spacing value in the app.
// Never hardcode a hex color or magic number directly in a component again —
// import from here instead. Changing a value here updates it everywhere.

export const colors = {
  // Background layers — darkest to lightest
  bg: '#0b1220',            // Base screen background
  surface: '#101826',        // Cards, panels
  surfaceInset: '#0d1420',   // Nested elements (inputs, gauge shell)

  // Borders
  border: 'rgba(148, 163, 184, 0.12)',
  borderSubtle: 'rgba(148, 163, 184, 0.08)',

  // Text — only 3 tiers, used consistently everywhere
  textPrimary: '#ffffff',
  textSecondary: '#94a3b8',
  textTertiary: '#64748b',

  // Brand
  primary: '#3b82f6',
  primarySoft: 'rgba(59, 130, 246, 0.16)',
  primaryBorder: 'rgba(59, 130, 246, 0.28)',

  // BMI category colors — the ONLY place these are defined
  underweight: '#3b82f6',
  normal: '#22c55e',
  overweight: '#f59e0b',
  obese: '#ef4444',

  // Status
  danger: '#fda4af',
};

export const radius = {
  sm: 12,   // small elements: toggle buttons, chips
  md: 16,   // inputs, history cards
  lg: 20,   // gauge shell, health tips card
  xl: 28,   // hero card, panel, result card
  pill: 999, // fully rounded (badges, chips)
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

// Maps a BMI value to its category name and theme color — the ONE place
// this logic lives, instead of duplicated getCategory()/getColor() functions
// scattered across index.tsx, BarGauge.tsx, and CurveGauge.tsx.
export const getBmiInfo = (bmi: number) => {
  if (bmi < 18.5) return { category: 'Underweight', color: colors.underweight };
  if (bmi < 25) return { category: 'Normal', color: colors.normal };
  if (bmi < 30) return { category: 'Overweight', color: colors.overweight };
  return { category: 'Obese', color: colors.obese };
};