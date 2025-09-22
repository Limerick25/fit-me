interface FitMeLogoProps {
  size?: number;
  className?: string;
}

const FitMeLogo = ({ size = 40, className = '' }: FitMeLogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gradients for depth and muscle definition */}
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#8B9DC3', stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:'#3A5998', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#1E3A5F', stopOpacity:1}} />
        </linearGradient>

        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#FFE5B4', stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:'#DDB892', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#C19A6B', stopOpacity:1}} />
        </linearGradient>

        <linearGradient id="eyeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#FF6B6B', stopOpacity:0.9}} />
          <stop offset="100%" style={{stopColor:'#FF0000', stopOpacity:1}} />
        </linearGradient>

        {/* Shadow filter */}
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Background circle */}
      <circle cx="60" cy="60" r="58" fill="#F8F9FA" stroke="#E9ECEF" strokeWidth="2"/>

      {/* Lean muscular torso */}
      <g transform="translate(60, 85)">
        {/* Core torso - lean and defined */}
        <path d="M-18,-35 Q-20,-30 -18,-25 L-15,-10 Q-12,0 -8,5 L8,5 Q12,0 15,-10 L18,-25 Q20,-30 18,-35 Q15,-40 8,-42 L-8,-42 Q-15,-40 -18,-35 Z"
              fill="url(#bodyGradient)" filter="url(#shadow)"/>

        {/* Defined abs (6-pack) */}
        <ellipse cx="-5" cy="-25" rx="3" ry="4" fill="#C19A6B" opacity="0.7"/>
        <ellipse cx="5" cy="-25" rx="3" ry="4" fill="#C19A6B" opacity="0.7"/>
        <ellipse cx="-5" cy="-15" rx="3" ry="4" fill="#C19A6B" opacity="0.7"/>
        <ellipse cx="5" cy="-15" rx="3" ry="4" fill="#C19A6B" opacity="0.7"/>
        <ellipse cx="-4" cy="-5" rx="2.5" ry="3" fill="#C19A6B" opacity="0.7"/>
        <ellipse cx="4" cy="-5" rx="2.5" ry="3" fill="#C19A6B" opacity="0.7"/>

        {/* Defined pecs */}
        <ellipse cx="-8" cy="-35" rx="6" ry="5" fill="#DDB892" opacity="0.8"/>
        <ellipse cx="8" cy="-35" rx="6" ry="5" fill="#DDB892" opacity="0.8"/>

        {/* Muscular arms */}
        <ellipse cx="-22" cy="-25" rx="5" ry="12" fill="url(#bodyGradient)" filter="url(#shadow)"/>
        <ellipse cx="22" cy="-25" rx="5" ry="12" fill="url(#bodyGradient)" filter="url(#shadow)"/>

        {/* Bicep definition */}
        <ellipse cx="-22" cy="-30" rx="3" ry="5" fill="#C19A6B" opacity="0.6"/>
        <ellipse cx="22" cy="-30" rx="3" ry="5" fill="#C19A6B" opacity="0.6"/>
      </g>

      {/* Modern fitness helmet instead of Shredder's traditional look */}
      <g transform="translate(60, 45)">
        {/* Sleek fitness helmet/headband */}
        <path d="M-20,-25 Q-25,-30 -25,-35 Q-25,-45 -20,-50 Q-10,-55 0,-55 Q10,-55 20,-50 Q25,-45 25,-35 Q25,-30 20,-25 L15,-15 Q10,-10 0,-10 Q-10,-10 -15,-15 Z"
              fill="url(#metalGradient)" filter="url(#shadow)"/>

        {/* Modern fitness vibes - sleeker lines */}
        <path d="M-15,-45 Q0,-50 15,-45" stroke="#1E3A5F" strokeWidth="2" fill="none"/>
        <path d="M-18,-35 Q0,-40 18,-35" stroke="#1E3A5F" strokeWidth="1.5" fill="none"/>

        {/* Face area - more athletic look */}
        <path d="M-15,-15 Q-10,-20 0,-20 Q10,-20 15,-15 L12,-5 Q8,0 0,0 Q-8,0 -12,-5 Z"
              fill="#2C3E50" opacity="0.9"/>

        {/* Determined eyes with fitness focus */}
        <ellipse cx="-6" cy="-12" rx="3" ry="2" fill="url(#eyeGlow)"/>
        <ellipse cx="6" cy="-12" rx="3" ry="2" fill="url(#eyeGlow)"/>

        {/* Eye determination */}
        <ellipse cx="-6" cy="-12" rx="1.5" ry="1" fill="#FFFF00" opacity="0.8"/>
        <ellipse cx="6" cy="-12" rx="1.5" ry="1" fill="#FFFF00" opacity="0.8"/>

        {/* Breathing apparatus - fitness mask style */}
        <rect x="-8" y="-8" width="16" height="1" fill="#1E3A5F"/>
        <rect x="-8" y="-6" width="16" height="1" fill="#1E3A5F"/>
        <rect x="-8" y="-4" width="16" height="1" fill="#1E3A5F"/>

        {/* Side elements - more fitness oriented */}
        <path d="M-25,-35 L-30,-32 L-32,-38 Z" fill="url(#metalGradient)"/>
        <path d="M25,-35 L30,-32 L32,-38 Z" fill="url(#metalGradient)"/>
      </g>

      {/* Fitness themed elements - dumbbells */}
      <g transform="translate(35, 65)" opacity="0.6">
        <rect x="-1" y="-3" width="2" height="6" fill="#3A5998"/>
        <circle cx="0" cy="-3" r="1.5" fill="#3A5998"/>
        <circle cx="0" cy="3" r="1.5" fill="#3A5998"/>
      </g>

      <g transform="translate(85, 65)" opacity="0.6">
        <rect x="-1" y="-3" width="2" height="6" fill="#3A5998"/>
        <circle cx="0" cy="-3" r="1.5" fill="#3A5998"/>
        <circle cx="0" cy="3" r="1.5" fill="#3A5998"/>
      </g>
    </svg>
  );
};

export default FitMeLogo;