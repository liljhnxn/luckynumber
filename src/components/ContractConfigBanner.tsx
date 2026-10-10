"use client";

import { useState } from "react";
import { isAddress } from "viem";
import { botchainTestnet } from "@/config/network";
import { ExternalLink, Edit2, Check, AlertTriangle, ShieldCheck } from "lucide-react";

interface ContractConfigBannerProps {
  contractAddress: string;
  onUpdateAddress: (newAddress: string) => void;
}

export function ContractConfigBanner({
  contractAddress,
  onUpdateAddress,
}: ContractConfigBannerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempAddress, setTempAddress] = useState(contractAddress);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const trimmed = tempAddress.trim();
    if (!trimmed) {
      setError("Please provide a contract address");
      return;
    }
    if (!isAddress(trimmed)) {
      setError("Invalid Ethereum contract address format (must be 0x followed by 40 hex chars)");
      return;
    }
    setError(null);
    onUpdateAddress(trimmed);
    setIsEditing(false);
  };

  const isConfigured = Boolean(contractAddress && isAddress(contractAddress));

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-4">
      {!isConfigured ? (
        <div className="bg-amber-950/40 border border-amber-600/40 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl mt-0.5 sm:mt-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-amber-200">
                  Smart Contract Not Configured
                </h2>
                <p className="text-xs text-amber-300/80 mt-1 max-w-xl leading-relaxed">
                  To interact on Botchain Testnet, deploy the contract using{" "}
                  <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-200 font-mono">
                    npm run deploy:testnet
                  </code>{" "}
                  or paste an already deployed contract address below.
                </p>
              </div>
            </div>

            <button
              id="set-contract-btn"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap self-stretch sm:self-auto text-center"
            >
              Enter Contract Address
            </button>
          </div>

          {isEditing && (
            <div className="mt-4 pt-4 border-t border-amber-600/20 flex flex-col sm:flex-row gap-2">
              <input
                id="contract-address-input"
                type="text"
                placeholder="0x..."
                value={tempAddress}
                onChange={(e) => {
                  setTempAddress(e.target.value);
                  setError(null);
                }}
                className="flex-1 bg-black/50 border border-amber-500/40 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
              />
              <div className="flex gap-2">
                <button
                  id="save-contract-address-btn"
                  onClick={handleSave}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  id="cancel-contract-address-btn"
                  onClick={() => {
                    setIsEditing(false);
                    setError(null);
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-xs text-rose-400 mt-2">{error}</p>}
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl px-4 py-3 shadow-md backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-400">Deployed Contract:</span>
            <span className="font-mono text-indigo-300 font-medium">
              {contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}
            </span>
            <a
              id="explorer-contract-link"
              href={`${botchainTestnet.blockExplorers.default.url}/address/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-300 transition-colors inline-flex items-center p-1"
              title="View on BohrScan block explorer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center space-x-2">
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="0x..."
                  value={tempAddress}
                  onChange={(e) => setTempAddress(e.target.value)}
                  className="bg-black/50 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono text-white focus:outline-none focus:border-indigo-400 w-56"
                />
                <button
                  onClick={handleSave}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                id="edit-contract-btn"
                onClick={() => {
                  setTempAddress(contractAddress);
                  setIsEditing(true);
                }}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1 px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Change</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
