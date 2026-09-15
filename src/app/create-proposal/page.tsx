"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { isAddress, parseEther } from "viem";
import { BOTDAO_ABI, BOTDAO_CONTRACT_ADDRESS } from "@/contracts/botdao";
import { BOTCHAIN_CHAIN_ID } from "@/lib/config";
import { TransactionStatus, TxStep } from "@/components/TransactionStatus";
import { formatAddress } from "@/lib/format";
import {
  PlusCircle,
  AlertCircle,
  FileText,
  Clock,
  Coins,
  Wallet,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function CreateProposalPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [durationDays, setDurationDays] = useState("3");
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [formError, setFormError] = useState("");
  const [txStep, setTxStep] = useState<TxStep>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const { writeContractAsync, data: txHash } = useWriteContract();

  const { isLoading: isWaitingReceipt, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isWaitingReceipt) {
      setTxStep("confirming");
    } else if (isConfirmed) {
      setTxStep("success");
    }
  }, [isWaitingReceipt, isConfirmed]);

  const validateForm = () => {
    setFormError("");

    if (!recipient.trim() || !isAddress(recipient.trim())) {
      setFormError("Please enter a valid recipient Ethereum address (0x...)");
      return false;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setFormError("Requested amount must be greater than 0 BOT.");
      return false;
    }

    if (!description.trim()) {
      setFormError("Please provide a description or title for the proposal.");
      return false;
    }

    const durationNum = parseFloat(durationDays);
    if (isNaN(durationNum) || durationNum <= 0) {
      setFormError("Voting duration must be at least 1 hour / day.");
      return false;
    }

    return true;
  };

  const handleOpenReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowReviewModal(true);
    }
  };

  const handleConfirmSubmit = async () => {
    if (!isConnected) {
      setErrorMessage("Please connect your wallet to create a proposal.");
      setTxStep("error");
      return;
    }

    try {
      setShowReviewModal(false);
      setTxStep("awaiting_wallet");
      setErrorMessage("");

      const amountWei = parseEther(amount);
      const durationSeconds = BigInt(Math.floor(parseFloat(durationDays) * 24 * 3600));

      await writeContractAsync({
        address: BOTDAO_CONTRACT_ADDRESS,
        abi: BOTDAO_ABI,
        functionName: "createProposal",
        args: [recipient.trim() as `0x${string}`, amountWei, description.trim(), durationSeconds],
        chainId: BOTCHAIN_CHAIN_ID,
      });

      setTxStep("pending");
    } catch (err: any) {
      console.error("Create proposal error:", err);
      setErrorMessage(err?.shortMessage || err?.message || "Failed to create proposal.");
      setTxStep("error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <PlusCircle className="w-7 h-7 text-indigo-400" />
          Create Governance Proposal
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Submit an on-chain proposal to request native BOT funding from the BotDAO community treasury.
        </p>
      </div>

      {/* Form Container */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-glass relative">
        <form onSubmit={handleOpenReview} className="space-y-6">
          {/* Error banner */}
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Proposal Title & Description
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Fund community developer tooling for Botchain ecosystem integrations"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Recipient */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-cyan-400" />
              Recipient Address (Where BOT will be sent if passed)
            </label>
            <input
              type="text"
              required
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {address && (
              <button
                type="button"
                onClick={() => setRecipient(address)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 mt-1 font-medium"
              >
                Use connected wallet address ({formatAddress(address)})
              </button>
            )}
          </div>

          {/* Amount Requested */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              Requested Funding Amount (BOT)
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0.0001"
                required
                placeholder="e.g. 25.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-400">
                BOT
              </span>
            </div>
          </div>

          {/* Voting Duration */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-pink-400" />
              Voting Duration (Days)
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {["1", "2", "3", "7"].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDurationDays(d)}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                    durationDays === d
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {d} {d === "1" ? "Day" : "Days"}
                </button>
              ))}
            </div>
            <input
              type="number"
              step="any"
              min="0.01"
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Or enter custom days..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isConnected}
            className="w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isConnected ? "Review Proposal" : "Connect Wallet to Submit"}</span>
          </button>
        </form>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 shadow-2xl border border-indigo-500/20 relative space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                Review On-Chain Proposal
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block">Description:</span>
                <span className="font-semibold text-white">{description}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-500">Recipient:</span>
                <span className="font-mono text-indigo-300 font-semibold">{formatAddress(recipient, 6)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-500">Requested Amount:</span>
                <span className="font-bold text-emerald-400">{amount} BOT</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-500">Voting Duration:</span>
                <span className="text-white font-medium">{durationDays} Days</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="w-1/2 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Confirm & Submit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction status tracker */}
      <TransactionStatus
        step={txStep}
        hash={txHash}
        errorMessage={errorMessage}
        successTitle="Proposal Created Successfully!"
        successDescription={`Your proposal has been registered on-chain and is now active for community voting.`}
        onClose={() => {
          setTxStep("idle");
          router.push("/proposals");
        }}
      />
    </div>
  );
}
