"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ContractConfigBanner } from "@/components/ContractConfigBanner";
import { SaveNumberCard } from "@/components/SaveNumberCard";
import { LookupWalletCard } from "@/components/LookupWalletCard";
import { getDefaultContractAddress } from "@/config/contract";
import { botchainMainnet } from "@/config/network";
import {
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  Database,
  CheckCircle,
  Globe,
} from "lucide-react";
import { BotChainLogo } from "@/components/BotChainLogo";

export default function Home() {
  const [contractAddress, setContractAddress] = useState<string>(() => getDefaultContractAddress());

  useEffect(() => {
    const defaultAddr = getDefaultContractAddress();
    const saved = localStorage.getItem("lucky_number_contract_address");

    // Enforce active Botchain Mainnet contract address, clearing any previous cache
    if (!saved || saved.toLowerCase() !== defaultAddr.toLowerCase()) {
      localStorage.setItem("lucky_number_contract_address", defaultAddr);
      setContractAddress(defaultAddr);
    } else {
      setContractAddress(saved);
    }
  }, []);

  const handleUpdateAddress = (newAddress: string) => {
    setContractAddress(newAddress);
    localStorage.setItem("lucky_number_contract_address", newAddress);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <div>
        <Navbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16">
          {/* Hero Section */}
          <section className="text-center max-w-3xl mx-auto mb-10">
            {/* Official BOT Chain Website & Explorer Quick Access Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
              <a
                id="hero-botchain-website"
                href="https://botchain.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 text-slate-200 text-xs font-semibold shadow-md transition-all group cursor-pointer"
                title="Visit Official BOT Chain Website"
              >
                <BotChainLogo className="w-4 h-4 rounded-sm" size={16} />
                <span className="group-hover:text-emerald-400 transition-colors">BOT Chain Website</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-400 opacity-70" />
              </a>

              <a
                id="hero-explorer-badge"
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/40 hover:border-emerald-500/70 text-emerald-300 text-xs font-semibold shadow-md transition-all group cursor-pointer"
                title="View Official BOT Chain Explorer"
              >
                <BotChainLogo className="w-4 h-4 rounded-sm" size={16} />
                <span>BOT Chain Explorer</span>
                <ExternalLink className="w-3 h-3 text-emerald-400 opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>

              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Mainnet 677</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              What&apos;s Your{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent">
                Lucky Number?
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-2xl mx-auto">
              Choose a number that represents you and save it on the blockchain.
              Your choice is permanently linked to your wallet and publicly viewable by anyone.
            </p>
          </section>

          {/* Contract Configuration / Active Address Banner */}
          <ContractConfigBanner
            contractAddress={contractAddress}
            onUpdateAddress={handleUpdateAddress}
          />

          {/* Main 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Column 1: Save Number Card */}
            <SaveNumberCard contractAddress={contractAddress} />

            {/* Column 2: Lookup Wallet Card */}
            <LookupWalletCard contractAddress={contractAddress} />
          </div>

          {/* BOT Chain Ecosystem & Protocol Specifications Section */}
          <section className="mt-16 pt-10 border-t border-slate-800/80">
            {/* Prominent BOT Chain Ecosystem Card */}
            <div className="bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 mb-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#090d1a] border border-cyan-500/30 flex items-center justify-center p-2.5 shadow-lg shadow-cyan-500/10">
                    <BotChainLogo className="w-9 h-9" size={36} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        BOT Chain
                      </h2>
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                        Mainnet 677
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300/80 mt-1 max-w-xl leading-relaxed">
                      High-performance decentralized Layer-1 EVM blockchain with 150 Million total BOT supply. Built for AI, high-throughput Web3 applications, and ultra-low gas execution.
                    </p>
                  </div>
                </div>

                {/* Ecosystem Links Buttons */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <a
                    id="botchain-website-link"
                    href="https://botchain.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Globe className="w-4 h-4" />
                    <span>BOT Chain Website</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>

                  <a
                    id="botchain-explorer-link"
                    href="https://scan.botchain.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/50 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <BotChainLogo className="w-4 h-4" size={16} />
                    <span>BOT Chain Explorer</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  </a>
                </div>
              </div>
            </div>

            {/* Protocol Specs Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200">BOT Chain Network</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Decentralized EVM blockchain with Chain ID{" "}
                  <code className="text-indigo-300 font-mono">677</code>. Total Supply of 150 Million BOT.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200">Strict Validation</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Numbers are strictly constrained between 1 and 100 inclusive. No zero, no negatives, no overflow.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
                    <Database className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200">Pure Web3 Architecture</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Zero backend servers and zero centralized databases. All state lives purely on the blockchain.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/70 bg-slate-950/80 backdrop-blur-md py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center space-x-2">
              <BotChainLogo className="w-5 h-5" size={20} />
              <span className="font-extrabold text-slate-100 tracking-tight">BOT Chain</span>
              <span className="text-slate-600">•</span>
              <span className="font-semibold text-indigo-400">LuckyNumber dApp</span>
            </div>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              | Mainnet Chain ID: 677
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <a
              id="footer-botchain-website"
              href="https://botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition-colors flex items-center space-x-1.5 font-medium"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>BOT Chain Website</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            <a
              id="footer-botchain-explorer"
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition-colors flex items-center space-x-1.5 font-medium"
            >
              <BotChainLogo className="w-3.5 h-3.5" size={14} />
              <span>BOT Chain Explorer</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            <a
              id="footer-botchain-rpc"
              href="https://rpc.botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 text-slate-500 transition-colors"
            >
              RPC: https://rpc.botchain.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
