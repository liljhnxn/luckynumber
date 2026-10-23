"use client";

import { useState } from "react";
import { botchainMainnet } from "@/config/network";
import { LUCKY_NUMBER_CONTRACT_ADDRESS } from "@/config/contract";
import { ExternalLink, Check, Copy, ShieldCheck } from "lucide-react";
import { BotChainLogo } from "./BotChainLogo";

export function ContractConfigBanner() {
  const [copied, setCopied] = useState(false);
  const contractAddress = LUCKY_NUMBER_CONTRACT_ADDRESS;

  const copyAddress = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-4">
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl px-4 py-3 shadow-lg backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center space-x-2 text-xs text-slate-300">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Mainnet Verified Contract</span>
          </div>

          <span className="font-mono text-indigo-300 font-medium tracking-tight">
            {contractAddress}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="copy-contract-address-btn"
            onClick={copyAddress}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors cursor-pointer"
            title="Copy contract address"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <a
            id="explorer-contract-link"
            href={`${botchainMainnet.blockExplorers.default.url}/address/${contractAddress}#code`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-cyan-300 transition-colors inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/30 font-medium text-xs shadow-sm cursor-pointer"
            title="View verified contract on BotchainScan"
          >
            <BotChainLogo className="w-3.5 h-3.5 rounded-sm" size={14} />
            <span className="text-cyan-400 font-semibold">BotchainScan</span>
            <ExternalLink className="w-3 h-3 text-cyan-400" />
          </a>
        </div>
      </div>
    </div>
  );
}
