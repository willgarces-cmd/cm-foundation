export default function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Ilustración de reparaciones del hogar"
    >
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22344A" />
          <stop offset="100%" stopColor="#0F1B29" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C98A1D" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#C98A1D" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="600" fill="url(#bgGrad)" />

      {/* líneas sutiles estilo plano técnico */}
      <g stroke="#F7F5F0" strokeOpacity="0.07" strokeWidth="1">
        <line x1="0" y1="120" x2="800" y2="120" />
        <line x1="0" y1="300" x2="800" y2="300" />
        <line x1="0" y1="480" x2="800" y2="480" />
        <line x1="200" y1="0" x2="200" y2="600" />
        <line x1="600" y1="0" x2="600" y2="600" />
      </g>

      <circle cx="560" cy="220" r="220" fill="url(#glow)" />

      {/* silueta de casa, estilo plano arquitectónico */}
      <g stroke="#C98A1D" strokeWidth="3" fill="none" strokeLinejoin="round" opacity="0.9">
        <path d="M 480 560 L 480 380 L 620 280 L 760 380 L 760 560 Z" />
        <line x1="480" y1="460" x2="760" y2="460" />
        <rect x="660" y="470" width="60" height="90" />
        <rect x="520" y="410" width="50" height="50" />
      </g>

      {/* llave inglesa, ícono geométrico */}
      <g transform="translate(160,300) rotate(-28)" fill="#C98A1D">
        <circle cx="0" cy="0" r="34" />
        <circle cx="0" cy="0" r="16" fill="#0F1B29" />
        <rect x="-9" y="0" width="18" height="150" rx="9" />
        <circle cx="0" cy="150" r="24" />
        <circle cx="0" cy="150" r="10" fill="#0F1B29" />
      </g>
    </svg>
  );
}
