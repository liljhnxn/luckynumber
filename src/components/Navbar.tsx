"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { botchainMainnet } from "@/config/network";
import { Sparkles, Wallet, Check, Copy, LogOut, AlertCircle, RefreshCw, ExternalLink } from "lucide-react";
import { BotChainLogo } from "./BotChainLogo";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, isConnecting } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isWrongNetwork = isConnected && chainId !== botchainMainnet.id;

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = () => {
    const injectedConnector = connectors.find((c) => c.id === "injected") || connectors[0];
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Logo and Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-[#090d1a] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                LuckyNumber
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                Botchain
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">On-Chain Favorite Number</p>
          </div>
        </div>

        {/* Network & Wallet Controls */}
        <div className="flex items-center space-x-2.5">
          {/* BOT Chain Website link */}
          <a
            id="nav-botchain-website-link"
            href="https://botchain.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 transition-all group"
            title="Visit BOT Chain Website"
          >
            <BotChainLogo className="w-3.5 h-3.5" size={14} />
            <span className="group-hover:text-cyan-300 transition-colors">BOT Chain</span>
            <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </a>

          {/* BOT Chain Explorer link */}
          <a
            id="nav-explorer-link"
            href="https://scan.botchain.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 transition-all group"
            title="Open BOT Chain Explorer"
          >
            <span>Explorer</span>
            <ExternalLink className="w-3 h-3 text-cyan-400 group-hover:rotate-45 transition-transform" />
          </a>

          {!mounted ? (
            <button
              id="connect-wallet-btn"
              disabled
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30 opacity-90 cursor-default"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          ) : (
            <>
              {/* Network Indicator / Switcher */}
              {isConnected && (
                <div>
                  {isWrongNetwork ? (
                    <button
                      id="switch-network-btn"
                      onClick={() => switchChain({ chainId: botchainMainnet.id })}
                      disabled={isSwitching}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all cursor-pointer"
                      title="Switch to Botchain Mainnet"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isSwitching ? "Switching..." : "Switch to Botchain Mainnet"}</span>
                    </button>
                  ) : (
                    <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Botchain Mainnet (677)</span>
                    </div>
                  )}
                </div>
              )}

              {/* Wallet Button */}
              {!isConnected ? (
                <button
                  id="connect-wallet-btn"
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4" />
                      <span>Connect Wallet</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-inner">
                  <button
                    id="copy-address-btn"
                    onClick={copyAddress}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer"
                    title="Click to copy address"
                  >
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span>{address ? shortenAddress(address) : ""}</span>
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-slate-200" />
                    )}
                  </button>
                  <button
                    id="disconnect-wallet-btn"
                    onClick={() => disconnect()}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Disconnect wallet"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
