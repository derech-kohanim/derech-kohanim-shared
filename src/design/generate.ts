/**
 * Emits the platform files from `tokens.ts`. Run `npm run tokens` after changing a token.
 *
 * Each component is its own repository, side by side under the project folder, so the
 * generator writes straight into the sibling repos and there is no manual copying.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { tokens, type ThemeColors } from './tokens';

// __dirname is <projectRoot>/derech-kohanim-shared/src/design - three levels down.
const projectRoot = resolve(__dirname, '../../..');

const BANNER = '/* Generated from derech-kohanim-shared/src/design/tokens.ts. Do not edit. */';

function kebab(value: string): string {
  return value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}

function cssVariables(colors: ThemeColors): string {
  return Object.entries(colors)
    .map(([name, value]) => `    --color-${kebab(name)}: ${value};`)
    .join('\n');
}

function buildCss(): string {
  const { colors, radius, space, typography, elevation, motion, touch } = tokens;

  const lines = (entries: [string, unknown][], format: (key: string, value: never) => string) =>
    entries.map(([key, value]) => format(key, value as never)).join('\n');

  const radii = lines(Object.entries(radius), (k, v) => `    --radius-${k}: ${v}px;`);
  const spacing = lines(Object.entries(space), (k, v) => `    --space-${k}: ${v}px;`);
  const sizes = lines(
    Object.entries(typography.size),
    (k, v) => `    --font-size-${kebab(k)}: ${v}px;`,
  );
  const weights = lines(
    Object.entries(typography.weight),
    (k, v) => `    --font-weight-${k}: ${v};`,
  );
  const lineHeights = lines(
    Object.entries(typography.lineHeight),
    (k, v) => `    --line-height-${k}: ${v};`,
  );
  const shadows = lines(Object.entries(elevation), (k, v) => `    --elevation-${k}: ${v};`);
  const durations = lines(
    Object.entries(motion.duration),
    (k, v) => `    --duration-${k}: ${v}ms;`,
  );
  const easings = lines(Object.entries(motion.easing), (k, v) => `    --easing-${k}: ${v};`);

  return `${BANNER}

:root {
    --font-ui: ${typography.fontFamily.ui};
    --font-nav: ${typography.fontFamily.nav};
${radii}
${spacing}
${sizes}
${weights}
${lineHeights}
${shadows}
${durations}
${easings}
    --touch-min: ${touch.minTarget}px;
    --touch-comfortable: ${touch.comfortableTarget}px;

${cssVariables(colors.light)}
}

:root[data-theme='dark'] {
${cssVariables(colors.dark)}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
${cssVariables(colors.dark)}
  }
}
`;
}

function hslToArgb(hsl: string): string {
  const [h, s, l] = hsl.split(' ').map((part) => Number.parseFloat(part));
  const saturation = s / 100;
  const lightness = l / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lightness - chroma / 2;

  const [r, g, b] =
    h < 60
      ? [chroma, x, 0]
      : h < 120
        ? [x, chroma, 0]
        : h < 180
          ? [0, chroma, x]
          : h < 240
            ? [0, x, chroma]
            : h < 300
              ? [x, 0, chroma]
              : [chroma, 0, x];

  const toHex = (channel: number) =>
    Math.round((channel + m) * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();

  return `0xFF${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function composeColors(name: string, colors: ThemeColors): string {
  const entries = Object.entries(colors)
    .map(([key, value]) => `    val ${key}: Color = Color(${hslToArgb(value)})`)
    .join('\n');
  return `object ${name} {\n${entries}\n}`;
}

function buildKotlin(): string {
  const { colors, radius, space, typography, motion, touch } = tokens;

  const radii = Object.entries(radius)
    .map(([name, value]) => `    val ${name}: Dp = ${value}.dp`)
    .join('\n');
  const spacing = Object.entries(space)
    .map(([name, value]) => `    val s${name}: Dp = ${value}.dp`)
    .join('\n');
  const sizes = Object.entries(typography.size)
    .map(([name, value]) => `    val ${name}: TextUnit = ${value}.sp`)
    .join('\n');
  const durations = Object.entries(motion.duration)
    .map(([name, value]) => `    const val ${name}: Int = ${value}`)
    .join('\n');

  return `// Generated from derech-kohanim-shared/src/design/tokens.ts. Do not edit.
package com.abaye.derechkohanim.ui.theme

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

${composeColors('LightColors', colors.light)}

${composeColors('DarkColors', colors.dark)}

object Radius {
${radii}
}

object Space {
${spacing}
}

object FontSize {
${sizes}
}

object MotionDuration {
${durations}
}

object Touch {
    val minTarget: Dp = ${touch.minTarget}.dp
    val comfortableTarget: Dp = ${touch.comfortableTarget}.dp
}
`;
}

function write(relativePath: string, contents: string): void {
  const target = join(projectRoot, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, contents, 'utf8');
  process.stdout.write(`wrote ${relativePath}\n`);
}

write('derech-kohanim-web/src/styles/tokens.css', buildCss());
write(
  'derech-kohanim-android/app/src/main/java/com/abaye/derechkohanim/ui/theme/Tokens.kt',
  buildKotlin(),
);
