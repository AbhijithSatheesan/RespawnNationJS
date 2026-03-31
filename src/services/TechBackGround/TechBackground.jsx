import React from 'react';
import { useSelector } from 'react-redux';

// --- INLINE SVG ICONS (Kept definitions in case you need them later, but they are not used in render now) ---
const TrophyIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const RadioIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
    <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
    <circle cx="12" cy="12" r="2" />
    <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
    <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
  </svg>
);

const GamepadIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="12" x2="10" y2="12" />
    <line x1="8" y1="10" x2="8" y2="14" />
    <line x1="15" y1="13" x2="15.01" y2="13" />
    <line x1="18" y1="11" x2="18.01" y2="11" />
    <rect x="2" y="6" width="20" height="12" rx="2" />
  </svg>
);

const MonitorIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const TechBackground = ({ children }) => {
  // We still need the color for the background lines
  const color = useSelector(state => state.ui?.backgroundColor || state.techBackground?.color || "#1a1a2e");

  // --- HELPERS ---
  const createHexagon = (cx, cy, r) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

  const GlowPath = ({ d, strokeWidth = 2, opacity = 1 }) => (
    <g>
        <path d={d} strokeWidth={strokeWidth * 4} opacity={opacity * 0.15} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} strokeWidth={strokeWidth} opacity={opacity} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );

  const GlowHex = ({ points, strokeWidth = 2, opacity = 1 }) => (
    <g>
        <polygon points={points} strokeWidth={strokeWidth * 4} opacity={opacity * 0.15} strokeLinejoin="round" />
        <polygon points={points} strokeWidth={strokeWidth} opacity={opacity} strokeLinejoin="round" />
    </g>
  );

  const TopLeftCircuit = () => (
    <g>
        <g>
            <GlowHex points={createHexagon(0, 0, 80)} strokeWidth={2.5} opacity={1} />
            <GlowHex points={createHexagon(0, 0, 70)} strokeWidth={1} opacity={0.8} />
            <GlowHex points={createHexagon(0, 0, 60)} strokeWidth={1.5} opacity={0.8} />
            <circle cx="0" cy="0" r="30" strokeWidth={1} opacity={0.5} />
        </g>
        <g>
            <GlowPath d="M90,10 L300,10 L350,60 L600,60" strokeWidth={2.5} />
            <path d="M90,25 L295,25 L345,75 L600,75" strokeWidth={1} opacity="0.5" />
        </g>
        <g>
            <GlowPath d="M100,35 L280,35 L330,85 L550,85" strokeWidth={1.5} opacity={0.8} />
            <path d="M100,45 L275,45 L325,95 L550,95" strokeWidth={1} opacity="0.3" />
        </g>
        <g>
            <g>
                <GlowPath d="M80,-40 L150,-40 L200,-90 L400,-90" strokeWidth={1.5} />
                <circle cx="400" cy="-90" r="2.5" fill="currentColor" />
                <path d="M90,-30 L145,-30 L195,-80 L380,-80" strokeWidth={1} opacity="0.4" />
                <circle cx="380" cy="-80" r="1.5" fill="currentColor" />
            </g>
            <g>
                <GlowPath d="M0,90 L0,200 L-40,240 L-40,350" strokeWidth={1.5} />
                <circle cx="-40" cy="350" r="2.5" fill="currentColor" />
                <path d="M-15,85 L-15,195 L-55,235 L-55,330" strokeWidth={1} opacity="0.4" />
                <circle cx="-55" cy="330" r="1.5" fill="currentColor" />
            </g>
        </g>
        <g>
            <path d="M600,60 L620,40 L640,60 L620,80 Z" strokeWidth="1.5" fill="none" />
            <line x1="620" y1="60" x2="700" y2="60" strokeWidth="1" opacity="0.3" />
        </g>
    </g>
  );

  const BottomRightCircuit = () => (
    <g>
        <GlowPath d="M0,0 L60,0" strokeWidth={3} />
        <circle cx="0" cy="0" r="6" fill="currentColor" />
        <g>
            <GlowPath d="M60,0 L90,10 L300,10 L350,60 L600,60" strokeWidth={2.5} />
            <path d="M60,0 L90,25 L295,25 L345,75 L600,75" strokeWidth={1} opacity="0.5" />
        </g>
        <g>
            <GlowPath d="M40,0 L100,35 L280,35 L330,85 L550,85" strokeWidth={1.5} opacity={0.8} />
            <path d="M40,0 L100,45 L275,45 L325,95 L550,95" strokeWidth={1} opacity="0.3" />
        </g>
        <g>
            <g>
                <GlowPath d="M30,0 L80,-40 L150,-40 L200,-90 L400,-90" strokeWidth={1.5} />
                <circle cx="400" cy="-90" r="2.5" fill="currentColor" />
                <path d="M30,0 L90,-30 L145,-30 L195,-80 L380,-80" strokeWidth={1} opacity="0.4" />
                <circle cx="380" cy="-80" r="1.5" fill="currentColor" />
            </g>
            <g>
                <GlowPath d="M0,0 L0,90 L0,200 L-40,240 L-40,350" strokeWidth={1.5} />
                <circle cx="-40" cy="350" r="2.5" fill="currentColor" />
                <path d="M0,0 L-15,85 L-15,195 L-55,235 L-55,330" strokeWidth={1} opacity="0.4" />
                <circle cx="-55" cy="330" r="1.5" fill="currentColor" />
            </g>
        </g>
        <g>
            <path d="M600,60 L620,40 L640,60 L620,80 Z" strokeWidth="1.5" fill="none" />
            <line x1="620" y1="60" x2="700" y2="60" strokeWidth="1" opacity="0.3" />
        </g>
    </g>
  );

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden font-mono select-none">
      
      {/* SVG BACKGROUND LAYER (z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 1920 1080" 
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="fade-right" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="fade-left" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>
          </defs>

          <g 
            style={{ 
              stroke: color,
              fill: color, 
              transition: 'stroke 1s ease, fill 1s ease'
            }}
            strokeLinecap="round"
            strokeLinejoin="round"
            fillOpacity="1" 
          >
            {/* Top Left */}
            <g transform="translate(120, 120)" fill="none">
              <TopLeftCircuit />
            </g>
            {/* Mirrored Bottom Left */}
            <g transform="translate(120, 960) scale(1, -1)" fill="none" opacity="0.7">
              <TopLeftCircuit />
            </g>
            {/* Bottom Right */}
            <g transform="translate(1800, 960) rotate(180)" fill="none">
              <BottomRightCircuit />
            </g>
            {/* Mirrored Top Right */}
            <g transform="translate(1800, 120) scale(1, -1) rotate(180)" fill="none" opacity="0.7">
              <BottomRightCircuit />
            </g>
            {/* Borders */}
            <g fill="none">
                <g>
                    <path d="M500,40 L1920,40" stroke="url(#fade-right)" strokeWidth="1.5" />
                    <path d="M500,50 L1920,50" stroke="url(#fade-right)" strokeWidth="1" opacity="0.4" />
                    <path d="M550,70 L1920,70" stroke="url(#fade-right)" strokeWidth="1" opacity="0.3" />
                    <path d="M600,85 L1800,85" stroke="url(#fade-right)" strokeWidth="1" opacity="0.2" />
                </g>
                <g>
                    <path d="M0,1040 L1420,1040" stroke="url(#fade-left)" strokeWidth="1.5" />
                    <path d="M0,1030 L1420,1030" stroke="url(#fade-left)" strokeWidth="1" opacity="0.4" />
                    <path d="M0,1010 L1370,1010" stroke="url(#fade-left)" strokeWidth="1" opacity="0.3" />
                    <path d="M100,995 L1320,995" stroke="url(#fade-left)" strokeWidth="1" opacity="0.2" />
                </g>
            </g>
            {/* Honeycomb */}
            <g>
                <g transform="translate(1800, 100)" opacity="0.4" fill="none">
                    <polygon points={createHexagon(0, 0, 40)} strokeWidth="1" />
                    <polygon points={createHexagon(-70, 40, 40)} strokeWidth="1" />
                    <path d="M0,40 L0,80 L-30,110" />
                    <path d="M5,40 L5,78 L-25,108" strokeWidth="0.5" /> 
                    <circle cx="-30" cy="110" r="2" fill={color} stroke="none" />
                </g>
                <g transform="translate(1650, 180)" opacity="0.2" fill="none">
                    <polygon points={createHexagon(0, 0, 40)} strokeWidth="1" />
                    <polygon points={createHexagon(-70, 40, 40)} strokeWidth="1" />
                    <path d="M0,40 L0,80 L-30,110" />
                    <circle cx="-30" cy="110" r="2" fill={color} stroke="none" />
                </g>
            </g>
            <g>
                <g transform="translate(100, 980)" opacity="0.4" fill="none">
                    <polygon points={createHexagon(0, 0, 50)} strokeWidth="1" />
                    <polygon points={createHexagon(86, -50, 50)} strokeWidth="1" />
                    <path d="M86,-100 L86,-140 L120,-170" />
                    <path d="M92,-100 L92,-138 L125,-170" strokeWidth="0.5" />
                    <circle cx="120" cy="-170" r="2" fill={color} stroke="none" />
                </g>
                <g transform="translate(250, 900)" opacity="0.2" fill="none">
                    <polygon points={createHexagon(0, 0, 50)} strokeWidth="1" />
                    <polygon points={createHexagon(86, -50, 50)} strokeWidth="1" />
                    <path d="M86,-100 L86,-140 L120,-170" />
                    <circle cx="120" cy="-170" r="2" fill={color} stroke="none" />
                </g>
            </g>
          </g>
        </svg>
      </div>

      {/* 3. CONTENT LAYER (z-10) - THIS IS WHERE YOUR PAGE GOES */}
      <div className="absolute inset-0 z-10 overflow-y-auto">
        {children}
      </div>

    </div>
  );
};

export default TechBackground;
























