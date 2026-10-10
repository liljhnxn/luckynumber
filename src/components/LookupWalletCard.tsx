"use client";

import { useState, useEffect } from "react";
import { isAddress } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { LUCKY_NUMBER_ABI } from "@/config/contract";
import { Search, Wallet, AlertCircle, Loader2, UserCheck, HelpCircle } from "lucide-react";

interface LookupWalletCardProps {
  contractAddress: string;
}

interface LookupResult {
  address: string;
  hasNumber: boolean;
  number: number | null;
}

export function LookupWalletCard({ contractAddress }: LookupWalletCardProps) {
  const [mounted, setMounted] = useState(false);
  const { address: userAddress, isConnected } = useAccount();
  const publicClient = usePublicClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const [searchAddress, setSearchAddress] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  const isValidContract = Boolean(contractAddress && isAddress(contractAddress));

  const handleSearch = async (targetAddr?: string) => {
    const addressToQuery = (targetAddr || searchAddress).trim();

    if (!addressToQuery) {
      setValidationError("Please enter an Ethereum wallet address.");
      setResult(null);
      return;
    }

    if (!isAddress(addressToQuery)) {
      setValidationError("Invalid address format. Address must be a 42-character hex string starting with 0x.");
      setResult(null);
      return;
    }

    if (!isValidContract) {
      setValidationError("Please configure a valid smart contract address first.");
      setResult(null);
      return;
    }

    setValidationError(null);
    setQueryError(null);
    setIsLoading(true);
    setResult(null);

    try {
      if (!publicClient) {
        throw new Error("Blockchain client not initialized.");
      }

      // Query hasNumber
      const hasNum = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: LUCKY_NUMBER_ABI,
        functionName: "hasNumber",
        args: [addressToQuery as `0x${string}`],
      });

      let numVal: number | null = null;
      if (hasNum) {
        const num = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: LUCKY_NUMBER_ABI,
          functionName: "getNumber",
          args: [addressToQuery as `0x${string}`],
        });
        numVal = Number(num);
      }

      setResult({
        address: addressToQuery,
        hasNumber: Boolean(hasNum),
        number: numVal,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setQueryError("Failed to read from smart contract: " + err.message);
      } else {
        setQueryError("Unable to fetch data from smart contract.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseMyAddress = () => {
    if (userAddress) {
      setSearchAddress(userAddress);
      setValidationError(null);
      handleSearch(userAddress);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
      {/* Decorative ambient gradient */}
      <div className="absolute -top-24 -left-24 w-52 h-52 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Card Header */}
        <div className="pb-6 border-b border-slate-800/70">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" />
            Look Up a Wallet
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Query any Ethereum or Botchain wallet address to reveal their chosen number.
          </p>
        </div>

        {/* Input Form */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="wallet-address-input"
              className="text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Wallet Address
            </label>
            {mounted && isConnected && userAddress && (
              <button
                id="lookup-my-wallet-btn"
                onClick={handleUseMyAddress}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Use My Wallet</span>
              </button>
            )}
          </div>

          <div className="relative">
            <input
              id="wallet-address-input"
              type="text"
              placeholder="0x1234...abcd"
              value={searchAddress}
              onChange={(e) => {
                setSearchAddress(e.target.value);
                setValidationError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>

          {validationError && (
            <p className="text-xs text-rose-400 flex items-center gap-1.5 pt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{validationError}</span>
            </p>
          )}

          <button
            id="find-number-btn"
            onClick={() => handleSearch()}
            disabled={isLoading || !isValidContract}
            className="w-full py-3 px-5 rounded-2xl font-bold text-sm bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-600/20 hover:shadow-cyan-600/40 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Querying Blockchain...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Find Number</span>
              </>
            )}
          </button>
        </div>

        {/* Query Error */}
        {queryError && (
          <div className="mt-4 p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-300">
            {queryError}
          </div>
        )}

        {/* Results Area */}
        {result && (
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            {result.hasNumber && result.number !== null ? (
              <div className="bg-gradient-to-b from-indigo-950/40 to-slate-950/70 border border-indigo-500/40 rounded-2xl p-5 text-center space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Wallet Lucky Number Found
                </span>

                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[2px] shadow-lg shadow-indigo-500/30">
                    <div className="w-full h-full bg-[#090e1f] rounded-full flex flex-col items-center justify-center">
                      <span className="text-3xl font-black bg-gradient-to-b from-white to-indigo-200 bg-clip-text text-transparent">
                        #{result.number}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-slate-400 font-mono break-all px-2">
                    {result.address}
                  </p>
                  <span className="inline-block mt-2 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    Stored on Botchain Testnet
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-slate-400">
                  <HelpCircle className="w-6 h-6 text-slate-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-200">
                  No Number Selected
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  This wallet address has not chosen or saved a lucky number yet on this contract.
                </p>
                <p className="text-[11px] text-slate-500 font-mono pt-1">
                  {result.address.slice(0, 10)}...{result.address.slice(-8)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <Wallet className="w-3 h-3 text-slate-400" />
          Public On-Chain Records
        </span>
        <span>Zero fees for reading</span>
      </div>
    </div>
  );
}
