"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { isAddress } from "viem";
import { LUCKY_NUMBER_ABI } from "@/config/contract";
import { botchainTestnet } from "@/config/network";
import {
  Sparkles,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Loader2,
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react";

interface SaveNumberCardProps {
  contractAddress: string;
}

const POPULAR_NUMBERS = [7, 11, 21, 42, 69, 77, 88, 100];

export function SaveNumberCard({ contractAddress }: SaveNumberCardProps) {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [selectedNumber, setSelectedNumber] = useState<number>(7);
  const [inputVal, setInputVal] = useState<string>("7");
  const [lastSavedNumber, setLastSavedNumber] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isValidContract = Boolean(contractAddress && isAddress(contractAddress));
  const isCorrectNetwork = chainId === botchainTestnet.id;

  // Read current saved number for the connected wallet
  const {
    data: currentNumberOnChain,
    refetch: refetchUserNumber,
  } = useReadContract({
    address: isValidContract ? (contractAddress as `0x${string}`) : undefined,
    abi: LUCKY_NUMBER_ABI,
    functionName: "getNumber",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && isValidContract && Boolean(address),
    },
  });

  const {
    data: hasSavedNumber,
    refetch: refetchHasNumber,
  } = useReadContract({
    address: isValidContract ? (contractAddress as `0x${string}`) : undefined,
    abi: LUCKY_NUMBER_ABI,
    functionName: "hasNumber",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && isValidContract && Boolean(address),
    },
  });

  // Contract write hook
  const {
    data: txHash,
    writeContract,
    isPending: isSignPending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  // Wait for transaction receipt
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Handle number input change
  const handleInputChange = (val: string) => {
    setInputVal(val);
    setErrorMessage(null);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 1 && num <= 100) {
      setSelectedNumber(num);
    }
  };

  const handleSelectNumber = (num: number) => {
    setSelectedNumber(num);
    setInputVal(num.toString());
    setErrorMessage(null);
  };

  const handleStep = (delta: number) => {
    const next = Math.min(100, Math.max(1, selectedNumber + delta));
    handleSelectNumber(next);
  };

  // Submit number
  const handleSave = () => {
    if (!isConnected) return;
    if (!isValidContract) {
      setErrorMessage("Please configure a valid smart contract address first.");
      return;
    }
    if (!isCorrectNetwork) {
      setErrorMessage("Please switch your wallet network to Botchain Testnet (Chain ID 968).");
      return;
    }

    const num = parseInt(inputVal, 10);
    if (isNaN(num) || num < 1 || num > 100) {
      setErrorMessage("Lucky number must be an integer between 1 and 100 inclusive.");
      return;
    }

    setErrorMessage(null);
    try {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: LUCKY_NUMBER_ABI,
        functionName: "setNumber",
        args: [BigInt(num)],
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Transaction failed to initiate.");
      }
    }
  };

  // When tx confirms, update state and refetch
  useEffect(() => {
    if (isConfirmed && txHash) {
      setLastSavedNumber(selectedNumber);
      refetchUserNumber();
      refetchHasNumber();
    }
  }, [isConfirmed, txHash, selectedNumber, refetchUserNumber, refetchHasNumber]);

  // Sync write/confirm errors
  useEffect(() => {
    if (writeError) {
      if (writeError.message.includes("User rejected") || writeError.message.includes("rejected")) {
        setErrorMessage("Transaction was cancelled in your wallet.");
      } else {
        setErrorMessage(writeError.message.slice(0, 160));
      }
    } else if (confirmError) {
      setErrorMessage("Error confirming transaction on-chain: " + confirmError.message.slice(0, 120));
    }
  }, [writeError, confirmError]);

  const effectiveConnected = mounted && isConnected;
  const num = parseInt(inputVal, 10);
  const isNumberValid = !isNaN(num) && num >= 1 && num <= 100;
  const isTxPending = isSignPending || isConfirming;
  const isSaveDisabled = !effectiveConnected || !isNumberValid || isTxPending || !isValidContract;

  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
      {/* Decorative gradient corner glow */}
      <div className="absolute -top-24 -right-24 w-52 h-52 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800/70">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Save Your Number
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select any number from 1 to 100 and record it on Botchain.
            </p>
          </div>

          {/* Current saved status pill */}
          {effectiveConnected && hasSavedNumber && currentNumberOnChain !== undefined && (
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                Saved On-Chain
              </span>
              <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">
                #{currentNumberOnChain.toString()}
              </span>
            </div>
          )}
        </div>

        {/* Selected Number Preview (Main Visual Feature) */}
        <div className="my-8 flex flex-col items-center justify-center">
          <div className="relative group">
            {/* Ambient circular glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 blur-xl opacity-40 group-hover:opacity-70 transition-opacity" />

            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-b from-slate-900 via-indigo-950/70 to-slate-950 border-2 border-indigo-500/40 flex flex-col items-center justify-center shadow-2xl lucky-badge-glow">
              <span className="text-xs uppercase font-bold tracking-widest text-indigo-300/80 mb-1">
                Lucky Number
              </span>
              <span
                id="selected-number-preview"
                className="text-5xl sm:text-6xl font-black bg-gradient-to-b from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent drop-shadow-md"
              >
                {isNumberValid ? selectedNumber : "—"}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-1">1 - 100</span>
            </div>
          </div>

          {!isNumberValid && (
            <p className="text-xs text-rose-400 font-medium mt-3">
              Please enter an integer between 1 and 100
            </p>
          )}
        </div>

        {/* Visual Number Controls: Input + Stepper + Slider */}
        <div className="space-y-5">
          {/* Direct Input & Stepper */}
          <div className="flex items-center justify-center gap-3">
            <button
              id="decrement-btn"
              onClick={() => handleStep(-1)}
              disabled={selectedNumber <= 1 || isTxPending}
              className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-200 flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer"
              title="Decrease by 1"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="relative w-28">
              <input
                id="number-input"
                type="number"
                min="1"
                max="100"
                value={inputVal}
                onChange={(e) => handleInputChange(e.target.value)}
                disabled={isTxPending}
                className="w-full text-center text-xl font-bold bg-slate-950/90 border border-indigo-500/40 rounded-xl py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <button
              id="increment-btn"
              onClick={() => handleStep(1)}
              disabled={selectedNumber >= 100 || isTxPending}
              className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-200 flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer"
              title="Increase by 1"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Range Slider */}
          <div className="px-2">
            <input
              id="number-slider"
              type="range"
              min="1"
              max="100"
              value={isNumberValid ? selectedNumber : 1}
              onChange={(e) => handleSelectNumber(Number(e.target.value))}
              disabled={isTxPending}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
              <span>1</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>

          {/* Quick-Pick Numbers */}
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
              Quick Picks
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_NUMBERS.map((num) => (
                <button
                  key={num}
                  id={`quick-pick-${num}`}
                  onClick={() => handleSelectNumber(num)}
                  disabled={isTxPending}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    selectedNumber === num
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105"
                      : "bg-slate-800/90 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Action & States */}
      <div className="mt-8 pt-6 border-t border-slate-800/70 space-y-4">
        {/* Error message display */}
        {errorMessage && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Success Feedback Display */}
        {isConfirmed && txHash && lastSavedNumber !== null && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl shadow-lg space-y-2">
            <div className="flex items-center space-x-2 text-emerald-300 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Successfully saved number #{lastSavedNumber}!</span>
            </div>
            <p className="text-xs text-slate-300">
              Your lucky number is permanently stored on Botchain Testnet. You can change it anytime.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20 text-xs">
              <span className="text-slate-400 font-mono">
                Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </span>
              <a
                id="tx-explorer-link"
                href={`${botchainTestnet.blockExplorers.default.url}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 underline font-medium"
              >
                <span>View on BohrScan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Save Button */}
        <button
          id="save-number-btn"
          onClick={handleSave}
          disabled={isSaveDisabled}
          className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg ${
            isSaveDisabled
              ? "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 text-white shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:brightness-110 active:scale-[0.99]"
          }`}
        >
          {isSignPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Confirm in Wallet...</span>
            </>
          ) : isConfirming ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Saving to Botchain...</span>
            </>
          ) : !effectiveConnected ? (
            <span>Connect Wallet to Save</span>
          ) : hasSavedNumber && currentNumberOnChain !== undefined ? (
            <>
              <RotateCcw className="w-4 h-4" />
              <span>Update My Lucky Number</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Save My Number</span>
            </>
          )}
        </button>

        {/* Explanatory subtitle */}
        <p className="text-[11px] text-center text-slate-500">
          {!effectiveConnected
            ? "Connect your Web3 wallet to record your number on-chain."
            : !isValidContract
            ? "Contract address needs to be configured above to submit."
            : "Transactions are executed on Botchain Testnet (Chain ID 968)."}
        </p>
      </div>
    </div>
  );
}
