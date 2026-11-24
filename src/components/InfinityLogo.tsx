import React from 'react';

/**
 * Computes a mathematically balanced Lemniscate of Bernoulli SVG path
 * centered at (cx, cy) with half-width `rx` and vertical scale `ry`.
 */
export function buildLemniscatePath(
  cx = 120,
  cy = 50,
  rx = 92,
  ry = 78,
  steps = 160
): string {
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    // Start at the center crossing going toward top-right loop
    const t = (i / steps) * Math.PI * 2 + Math.PI / 4;
    const denom = 1 + Math.sin(t) * Math.sin(t);
    const x = cx + (rx * Math.cos(t)) / denom;
    const y = cy + (ry * Math.sin(t) * Math.cos(t)) / denom;
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `${points.join(' ')} Z`;
}

export const LEMNISCATE_VIEWBOX = '0 0 240 100';
export const LEMNISCATE_PATH = buildLemniscatePath(120, 50, 96, 86, 180);

interface InfinityLogoProps {
  className?: string;
  strokeColor?: string;
  accentColor?: string;
  strokeWidth?: number;
  animateOrb?: boolean;
  ariaHidden?: boolean;
}

export const InfinityLogo: React.FC<InfinityLogoProps> = ({
  className = 'w-10 h-5',
  strokeColor = '#242522',
  accentColor = '#7774A9',
  strokeWidth = 2.2,
  animateOrb = false,
  ariaHidden = true,
}) => {
  return (
    <svg
      viewBox={LEMNISCATE_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={ariaHidden}
    >
      <path
        d={LEMNISCATE_PATH}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {animateOrb && (
        <circle r={strokeWidth * 1.45} fill={accentColor}>
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            path={LEMNISCATE_PATH}
          />
        </circle>
      )}
    </svg>
  );
};
