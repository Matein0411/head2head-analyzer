import * as React from "react";

const Coin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width={48}
    height={48}
    {...props}
  >
    <circle cx="16" cy="16" r="14" fill="#fde047" stroke="#eab308" strokeWidth="2" />
    <text x="16" y="21" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#eab308">$</text>
  </svg>
);

export default Coin;
