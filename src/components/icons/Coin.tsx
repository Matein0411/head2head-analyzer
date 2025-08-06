interface CoinProps {
  className?: string;
  size?: number;
}

const Coin = ({ className = "", size = 24 }: CoinProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="url(#coinGradient)"
        stroke="#D4AF37"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="7"
        fill="none"
        stroke="#B8860B"
        strokeWidth="1"
      />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fill="#8B4513"
        fontSize="8"
        fontWeight="bold"
        fontFamily="serif"
      >
        C
      </text>
      <defs>
        <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FF8C00" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Coin;
