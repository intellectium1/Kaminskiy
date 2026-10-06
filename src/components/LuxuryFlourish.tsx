import React from 'react';

interface LuxuryFlourishProps {
  className?: string;
  variant?: 'corner-arcs' | 'subtle-lines' | 'gold-frame' | 'brand-symbol';
}

/**
 * Official Brand Symbol (Знак) from DUGA® Brandbook (Pages 14-17):
 * Golden logarithmic spiral of sun rays / солярный знак баран & рог изобилия (число Фи 1.618)
 */
export const KaminskiyBrandSymbol: React.FC<{
  className?: string;
  size?: number;
  color?: string;
}> = ({ className = '', size = 48, color = '#DE6C35' }) => {
  // Generates the radiating rays of the logarithmic spiral emblem
  const totalRays = 72;
  const rays = Array.from({ length: totalRays }, (_, i) => {
    const angle = (i / totalRays) * 2 * Math.PI;
    // Logarithmic spiral distribution
    const rInner = 14 + (i / totalRays) * 8 * Math.sin(angle * 0.5);
    const rOuter = 46 - (i / totalRays) * 4 * Math.cos(angle * 0.5);
    const x1 = 50 + rInner * Math.cos(angle);
    const y1 = 50 + rInner * Math.sin(angle);
    const x2 = 50 + rOuter * Math.cos(angle);
    const y2 = 50 + rOuter * Math.sin(angle);
    const width = i % 2 === 0 ? 1.4 : 0.9;
    return { x1, y1, x2, y2, width };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {rays.map((ray, i) => (
        <line
          key={i}
          x1={ray.x1}
          y1={ray.y1}
          x2={ray.x2}
          y2={ray.y2}
          stroke={color}
          strokeWidth={ray.width}
          strokeLinecap="round"
          opacity={0.85 + (i % 2) * 0.15}
        />
      ))}
      {/* Central golden ratio seed */}
      <path
        d="M 50 32 C 60 38, 62 55, 52 64 C 44 72, 38 62, 42 52 C 45 44, 52 35, 50 32 Z"
        fill="#380812"
        opacity="0.9"
      />
    </svg>
  );
};

export const LuxuryFlourish: React.FC<LuxuryFlourishProps> = ({ className = '', variant = 'corner-arcs' }) => {
  if (variant === 'corner-arcs') {
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
        {/* Top-Right Decorative Sun Rays Pattern (Brandbook Pages 13 & 29) */}
        <svg
          className="absolute -top-24 -right-24 w-80 h-80 md:w-[480px] md:h-[480px] text-[#F5E5D3]/10"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.7"
        >
          {Array.from({ length: 36 }, (_, i) => {
            const angle = (i / 36) * (Math.PI / 2);
            const x = 200 - 190 * Math.cos(angle);
            const y = 190 * Math.sin(angle);
            return <line key={i} x1="200" y1="0" x2={x} y2={y} />;
          })}
          <circle cx="200" cy="0" r="45" stroke="#DE6C35" strokeWidth="0.8" opacity="0.3" />
          <circle cx="200" cy="0" r="95" stroke="#F5E5D3" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.2" />
          <circle cx="200" cy="0" r="150" stroke="#F5E5D3" strokeWidth="0.6" opacity="0.15" />
        </svg>

        {/* Bottom-Left Decorative Arcs */}
        <svg
          className="absolute -bottom-24 -left-24 w-80 h-80 md:w-[440px] md:h-[440px] text-[#F5E5D3]/10"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.7"
        >
          {Array.from({ length: 36 }, (_, i) => {
            const angle = (i / 36) * (Math.PI / 2);
            const x = 190 * Math.cos(angle);
            const y = 200 - 190 * Math.sin(angle);
            return <line key={i} x1="0" y1="200" x2={x} y2={y} />;
          })}
          <circle cx="0" cy="200" r="50" stroke="#DE6C35" strokeWidth="0.8" opacity="0.3" />
          <circle cx="0" cy="200" r="110" stroke="#F5E5D3" strokeWidth="0.6" opacity="0.2" />
        </svg>

        {/* Ambient Warm Burgundy Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#DE6C35]/8 rounded-full blur-[140px] pointer-events-none" />
      </div>
    );
  }

  return null;
};

/**
 * Official Brand Logo Lockup from DUGA® Brandbook (Pages 20-22 and uploaded files):
 * - «ДЕЛОВОЙ ЦЕНТР» (uppercase, font-norms, letter-spacing)
 * - «КАМИНСКИЙ» (uppercase, font-tercia / high contrast flared letterforms)
 * - «осн. 1887 год» (prominent 1887 with baseline alignment)
 */
export const KaminskiyLogo: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  subtitleVisible?: boolean;
  withSymbol?: boolean;
}> = ({ size = 'md', subtitleVisible = true, withSymbol = false }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className="flex flex-col items-center text-center select-none">
      {withSymbol && (
        <div className="mb-2">
          <KaminskiyBrandSymbol size={isSm ? 32 : isLg ? 48 : 40} color="#DE6C35" />
        </div>
      )}

      {/* Descriptor: ДЕЛОВОЙ ЦЕНТР */}
      <p
        className={`uppercase font-norms text-[#F5E5D3]/80 tracking-[0.34em] font-medium leading-none ${
          isSm ? 'text-[9px] mb-1' : isLg ? 'text-xs md:text-sm mb-2' : 'text-[10px] md:text-xs mb-1.5'
        }`}
      >
        ДЕЛОВОЙ ЦЕНТР
      </p>

      {/* Main Name: КАМИНСКИЙ */}
      <h1
        className={`font-tercia tracking-[0.24em] text-[#F5E5D3] font-light leading-none ${
          isSm ? 'text-xl md:text-2xl' : isLg ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-2xl md:text-3xl'
        }`}
      >
        КАМИНСКИЙ
      </h1>

      {/* Foundation Year: осн. 1887 год */}
      {subtitleVisible && (
        <div
          className={`flex items-baseline justify-center gap-1.5 font-norms text-[#F5E5D3]/75 tracking-wider ${
            isSm ? 'text-[10px] mt-1' : isLg ? 'text-xs md:text-sm mt-2' : 'text-[11px] mt-1.5'
          }`}
        >
          <span className="text-[10px] opacity-75 font-light tracking-[0.2em]">осн.</span>
          <span className="font-tercia font-normal text-sm md:text-base text-[#F5E5D3] tracking-[0.1em]">
            1887
          </span>
          <span className="text-[10px] opacity-75 font-light tracking-[0.2em]">год</span>
        </div>
      )}
    </div>
  );
};
