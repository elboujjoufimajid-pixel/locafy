interface Props {
  size?: number;
}

export default function Logo({ size = 36 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4B9EFF" />
          <stop offset="100%" stopColor="#1A3FC5" />
        </linearGradient>
        <filter id="pinShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#0F2A8A" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Rounded square background */}
      <rect width="40" height="40" rx="9" fill="url(#bg)" />

      {/* White location pin */}
      <path
        d="M20 4C13.4 4 8 9.4 8 16C8 22.6 20 38 20 38C20 38 32 22.6 32 16C32 9.4 26.6 4 20 4Z"
        fill="white"
        filter="url(#pinShadow)"
      />

      {/* House — roof */}
      <path
        d="M12.5 17.5L20 10L27.5 17.5Z"
        fill="#2563EB"
      />

      {/* House — chimney */}
      <rect x="22.5" y="11.5" width="2.5" height="3.5" fill="#2563EB" />

      {/* House — body */}
      <rect x="13.5" y="17.5" width="13" height="8" fill="#2563EB" />

      {/* Left window — 4 panes */}
      <rect x="14.5" y="18.8" width="1.9" height="1.5" rx="0.2" fill="white" />
      <rect x="17" y="18.8" width="1.9" height="1.5" rx="0.2" fill="white" />
      <rect x="14.5" y="21" width="1.9" height="1.5" rx="0.2" fill="white" />
      <rect x="17" y="21" width="1.9" height="1.5" rx="0.2" fill="white" />

      {/* Right window — 4 panes */}
      <rect x="21.1" y="18.8" width="1.9" height="1.5" rx="0.2" fill="white" />
      <rect x="23.6" y="18.8" width="1.9" height="1.5" rx="0.2" fill="white" />
      <rect x="21.1" y="21" width="1.9" height="1.5" rx="0.2" fill="white" />
      <rect x="23.6" y="21" width="1.9" height="1.5" rx="0.2" fill="white" />

      {/* Door */}
      <rect x="18.5" y="22" width="3" height="3.5" rx="0.6" fill="white" />
    </svg>
  );
}
