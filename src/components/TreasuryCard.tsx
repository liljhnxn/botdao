"use client";

import React, { useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { BOTDAO_ABI, BOTDAO_CONTRACT_ADDRESS } from "@/contracts/botdao";
import { formatBOT } from "@/lib/format";
import { BOTCHAIN_EXPLORER_URL } from "@/lib/config";
import { Vault, ArrowUpRight, ExternalLink, ShieldAlert, Sparkles, Coins } from "lucide-react";
import { TransactionStatus, TxStep } from "./TransactionStatus";

export function TreasuryCard() {
  const { isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState("");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [txStep, setTxStep] = useState<TxStep>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const { data: treasuryBalance, refetch: refetchBalance } = useReadContract({
    address: BOTDAO_CONTRACT_ADDRESS,
    abi: BOTDAO_ABI,
    functionName: "getTreasuryBalance",
  });

  const { data: quorumVotes } = useReadContract({
    address: BOTDAO_CONTRACT_ADDRESS,
    abi: BOTDAO_ABI,
    functionName: "quorumVotes",
  });

  const { writeContractAsync, data: txHash } = useWriteContract();

  const { isLoading: isWaitingForReceipt, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Track confirmation
  React.useEffect(() => {
    if (isWaitingForReceipt) {
      setTxStep("confirming");
    } else if (isConfirmed) {
      setTxStep("success");
      refetchBalance();
      setDepositAmount("");
    }
  }, [isWaitingForReceipt, isConfirmed, refetchBalance]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setErrorMessage("Please enter a valid deposit amount > 0");
      setTxStep("error");
      return;
    }

    try {
      setTxStep("awaiting_wallet");
      setErrorMessage("");
      const value = parseEther(depositAmount);

      const hash = await writeContractAsync({
        address: BOTDAO_CONTRACT_ADDRESS,
        abi: BOTDAO_ABI,
        functionName: "depositTreasury",
        value,
      });

      setTxStep("pending");
      setShowDepositModal(false);
    } catch (err: any) {
      console.error("Deposit error:", err);
      setErrorMessage(err?.shortMessage || err?.message || "Failed to deposit BOT");
      setTxStep("error");
    }
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border border-indigo-500/20 shadow-glow">
        {/* Glowing Background Radial */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
              <div className="w-5 h-5 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Vault className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <span>Community Vault</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                {formatBOT(treasuryBalance as bigint | undefined)}
              </h2>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                BOT
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-lg">
              On-chain community treasury pool reserved exclusively for approved DAO proposals and governance initiatives.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Quorum:</span>
                <span className="font-semibold text-white">{quorumVotes ? Number(quorumVotes) : 2} votes</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-700" />
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Contract:</span>
                {BOTDAO_CONTRACT_ADDRESS ? (
                  <a
                    href={`${BOTCHAIN_EXPLORER_URL}/address/${BOTDAO_CONTRACT_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-indigo-300 hover:text-indigo-200 inline-flex items-center gap-1"
                  >
                    <span>{BOTDAO_CONTRACT_ADDRESS.substring(0, 6)}...{BOTDAO_CONTRACT_ADDRESS.substring(BOTDAO_CONTRACT_ADDRESS.length - 4)}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-amber-400 font-mono">Not configured</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setShowDepositModal(true)}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <Coins className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Deposit BOT</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 shadow-2xl border border-indigo-500/20 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-indigo-400" />
                Deposit Native BOT to Treasury
              </h3>
              <button
                onClick={() => setShowDepositModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Deposited BOT funds will be locked in the smart contract treasury and can only be withdrawn when a community proposal is voted and passed.
            </p>

            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Deposit Amount (BOT)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0.0001"
                    required
                    placeholder="e.g. 10.5"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-400">
                    BOT
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex items-start gap-2.5 text-xs text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  All deposits trigger the on-chain <code className="font-mono text-indigo-200">TreasuryDeposit</code> event.
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="w-1/2 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isConnected || !depositAmount}
                  className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50"
                >
                  {isConnected ? "Confirm Deposit" : "Connect Wallet First"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction status tracker */}
      <TransactionStatus
        step={txStep}
        hash={txHash}
        errorMessage={errorMessage}
        successTitle="Deposit Successful!"
        successDescription={`Successfully deposited BOT into the DAO treasury.`}
        onClose={() => setTxStep("idle")}
      />
    </>
  );
}
