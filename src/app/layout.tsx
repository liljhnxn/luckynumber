import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "LuckyNumber | Save Your Favourite Number On-Chain",
  description: "Connect your wallet, pick your lucky number (1-100), and store it forever on Botchain Testnet.",
  keywords: ["Web3", "LuckyNumber", "Botchain", "Ethereum", "dApp", "Solidity"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="min-h-screen bg-[#070a13] text-slate-100 antialiased selection:bg-purple-500 selection:text-white"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
