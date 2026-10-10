"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ContractConfigBanner } from "@/components/ContractConfigBanner";
import { SaveNumberCard } from "@/components/SaveNumberCard";
import { LookupWalletCard } from "@/components/LookupWalletCard";
import { getDefaultContractAddress } from "@/config/contract";
import { botchainTestnet } from "@/config/network";
import {
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  Database,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  const [contractAddress, setContractAddress] = useState<string>(() => getDefaultContractAddress());

  useEffect(() => {
    // 1. Check localStorage first
    const saved = localStorage.getItem("lucky_number_contract_address");
    if (saved) {
      setContractAddress(saved);
      return;
    }

    // 2. Fall back to default from build / deployment config
    const defaultAddr = getDefaultContractAddress();
    if (defaultAddr) {
      setContractAddress(defaultAddr);
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
            {/* Network pill badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Live on Botchain Testnet (Chain ID: 968)</span>
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

          {/* Network & Protocol Info Section */}
          <section className="mt-16 pt-10 border-t border-slate-800/80">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 text-center mb-6">
              Protocol Specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200">Botchain Testnet</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Decentralized EVM blockchain with Chain ID{" "}
                  <code className="text-indigo-300 font-mono">968</code>. Transactions use BOT for gas.
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
      <footer className="w-full border-t border-slate-800/70 bg-slate-950/60 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-slate-300">LuckyNumber dApp</span>
            <span>•</span>
            <span>Botchain Network</span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href={botchainTestnet.blockExplorers.default.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors flex items-center space-x-1"
            >
              <span>BohrScan Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://rpc.bohr.life"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              RPC Endpoint
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
