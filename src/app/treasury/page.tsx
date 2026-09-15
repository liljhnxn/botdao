"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { BOTDAO_ABI, BOTDAO_CONTRACT_ADDRESS } from "@/contracts/botdao";
import { formatBOT } from "@/lib/format";
import { BOTCHAIN_EXPLORER_URL } from "@/lib/config";
import { TransactionStatus, TxStep } from "@/components/TransactionStatus";
import {
  Vault,
  Coins,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Lock,
  ArrowUpRight,
  TrendingUp,
  Scale,
} from "lucide-react";

export default function TreasuryPage() {
  const { isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState("");
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

  const { data: proposalCount } = useReadContract({
    address: BOTDAO_CONTRACT_ADDRESS,
    abi: BOTDAO_ABI,
    functionName: "getProposalCount",
  });

  const { writeContractAsync, data: txHash } = useWriteContract();

  const { isLoading: isWaitingReceipt, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isWaitingReceipt) {
      setTxStep("confirming");
    } else if (isConfirmed) {
      setTxStep("success");
      refetchBalance();
      setDepositAmount("");
    }
  }, [isWaitingReceipt, isConfirmed, refetchBalance]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setErrorMessage("Please enter an amount > 0 BOT");
      setTxStep("error");
      return;
    }

    try {
      setTxStep("awaiting_wallet");
      setErrorMessage("");
      const value = parseEther(depositAmount);

      await writeContractAsync({
        address: BOTDAO_CONTRACT_ADDRESS,
        abi: BOTDAO_ABI,
        functionName: "depositTreasury",
        value,
      });

      setTxStep("pending");
    } catch (err: any) {
      console.error("Deposit error:", err);
      setErrorMessage(err?.shortMessage || err?.message || "Deposit transaction failed");
      setTxStep("error");
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Vault className="w-7 h-7 text-indigo-400" />
          DAO Community Treasury
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Non-custodial smart contract vault holding native BOT tokens for community proposals.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Treasury Stats & Deposit Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Treasury Balance Banner */}
          <div className="glass-panel rounded-2xl p-8 border border-indigo-500/20 shadow-glow relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Smart Contract Vault Balance</span>
            </div>

            <div className="flex items-baseline gap-3 my-2">
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {formatBOT(treasuryBalance as bigint | undefined)}
              </h2>
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                BOT
              </span>
            </div>

            <p className="text-xs text-slate-300 max-w-md leading-relaxed mt-2">
              Funds stored in the DAO treasury can only be disbursed through approved and executed community proposals.
            </p>

            <div className="pt-6 mt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div>
                <span className="text-slate-500 block">Contract Address:</span>
                {BOTDAO_CONTRACT_ADDRESS ? (
                  <a
                    href={`${BOTCHAIN_EXPLORER_URL}/address/${BOTDAO_CONTRACT_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-indigo-300 hover:text-indigo-200 inline-flex items-center gap-1 font-medium mt-0.5"
                  >
                    <span>{BOTDAO_CONTRACT_ADDRESS}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-amber-400 font-mono">Not configured</span>
                )}
              </div>
            </div>
          </div>

          {/* Deposit Form Card */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-400" />
                Deposit BOT into Treasury
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Directly contribute native BOT tokens to increase the DAO funding capacity.
              </p>
            </div>

            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Amount to Deposit (BOT)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0.0001"
                    required
                    placeholder="e.g. 50.0"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-400">
                    BOT
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {["5", "10", "25", "100"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDepositAmount(preset)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                  >
                    +{preset} BOT
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={!isConnected || !depositAmount}
                className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Coins className="w-4 h-4" />
                <span>{isConnected ? "Deposit Native BOT" : "Connect Wallet to Deposit"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Treasury Architecture & Security Guarantees */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Treasury Security Architecture
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span><strong>Zero Owner Privileges:</strong> No admin can secretly withdraw or drain treasury funds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span><strong>Checks-Effects-Interactions:</strong> Protected with OpenZeppelin ReentrancyGuard against recursive calls.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <span><strong>Quorum Enforcement:</strong> Proposals require at least {quorumVotes ? Number(quorumVotes) : 2} community votes to execute.</span>
              </li>
            </ul>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-400" />
              Governance Metrics
            </h3>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Total Proposals Created:</span>
              <span className="font-semibold text-white">{proposalCount ? Number(proposalCount) : 0}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Voting Quorum:</span>
              <span className="font-semibold text-white">{quorumVotes ? Number(quorumVotes) : 2} Votes</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Governance Model:</span>
              <span className="font-semibold text-indigo-300">1 Wallet = 1 Vote</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction status tracker */}
      <TransactionStatus
        step={txStep}
        hash={txHash}
        errorMessage={errorMessage}
        successTitle="Deposit Confirmed!"
        successDescription={`Successfully deposited ${depositAmount} BOT into the community treasury.`}
        onClose={() => setTxStep("idle")}
      />
    </div>
  );
}
