import React from "react";

interface BotChainLogoProps {
  className?: string;
  size?: number;
}

export function BotChainLogo({ className = "w-6 h-6", size = 24 }: BotChainLogoProps) {
  return (
    <img
      src="/botchain-logo.png"
      alt="BOT Chain Logo"
      width={size}
      height={size}
      className={`rounded-md object-contain inline-block shrink-0 ${className}`}
    />
  );
}
