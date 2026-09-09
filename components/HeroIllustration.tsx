export default function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 700"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Ilustración de reparaciones del hogar"
    >
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2B4059" />
          <stop offset="55%" stopColor="#182B3E" />
          <stop offset="100%" stopColor="#0B1520" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8A93A" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#E8A93A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowSoft" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4E7DA8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#4E7DA8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="houseGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8A93A" />
          <stop offset="100%" stopColor="#C98A1D" />
        </linearGradient>
      </defs>

      <rect width="800" height="700" fill="url(#bgGrad)" />

      <circle cx="600" cy="180" r="280" fill="url(#glow)" />
      <circle cx="120" cy="520" r="240" fill="url(#glowSoft)" />

      {/* líneas sutiles estilo plano técnico */}
      <g stroke="#F7F5F0" strokeOpacity="0.06" strokeWidth="1">
        <line x1="0" y1="140" x2="800" y2="140" />
        <line x1="0" y1="350" x2="800" y2="350" />
        <line x1="0" y1="560" x2="800" y2="560" />
        <line x1="220" y1="0" x2="220" y2="700" />
        <line x1="620" y1="0" x2="620" y2="700" />
      </g>

      {/* silueta de casa con relleno degradado */}
      <g opacity="0.95">
        <path d="M 460 640 L 460 420 L 620 300 L 780 420 L 780 640 Z" fill="url(#houseGrad)" fillOpacity="0.12" stroke="url(#houseGrad)" strokeWidth="2.5" strokeLinejoin="round" />
        <line x1="460" y1="520" x2="780" y2="520" stroke="#E8A93A" strokeWidth="1.5" strokeOpacity="0.6" />
        <rect x="690" y="530" width="60" height="90" fill="#0B1520" fillOpacity="0.4" stroke="#E8A93A" strokeWidth="1.5" strokeOpacity="0.6" />
        <rect x="500" y="460" width="55" height="55" fill="#0B1520" fillOpacity="0.3" stroke="#E8A93A" strokeWidth="1.5" strokeOpacity="0.6" />
      </g>

      {/* llave inglesa, con sombra suave */}
      <g transform="translate(160,380) rotate(-28)">
        <g fill="#0B1520" opacity="0.25" transform="translate(6,10)">
          <circle cx="0" cy="0" r="34" />
          <rect x="-9" y="0" width="18" height="150" rx="9" />
          <circle cx="0" cy="150" r="24" />
        </g>
        <g fill="url(#houseGrad)">
          <circle cx="0" cy="0" r="34" />
          <circle cx="0" cy="0" r="16" fill="#182B3E" />
          <rect x="-9" y="0" width="18" height="150" rx="9" />
          <circle cx="0" cy="150" r="24" />
          <circle cx="0" cy="150" r="10" fill="#182B3E" />
        </g>
      </g>
    </svg>
  );
}
