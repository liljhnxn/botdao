"use client";

import React from "react";
import { Loader2, CheckCircle2, XCircle, ExternalLink, AlertTriangle } from "lucide-react";
import { BOTCHAIN_EXPLORER_URL } from "@/lib/config";

export type TxStep = "idle" | "preparing" | "awaiting_wallet" | "pending" | "confirming" | "success" | "error";

interface Props {
  step: TxStep;
  hash?: `0x${string}` | string;
  errorMessage?: string;
  successTitle?: string;
  successDescription?: string;
  onClose?: () => void;
}

export function TransactionStatus({
  step,
  hash,
  errorMessage,
  successTitle = "Transaction Confirmed!",
  successDescription = "The on-chain transaction has been successfully mined and verified.",
  onClose,
}: Props) {
  if (step === "idle") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel max-w-md w-full rounded-2xl p-6 shadow-2xl border border-indigo-500/20 text-center relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Status icon */}
        <div className="mb-4 flex justify-center">
          {step === "preparing" && (
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
          )}
          {step === "awaiting_wallet" && (
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-7 h-7 animate-bounce" />
            </div>
          )}
          {(step === "pending" || step === "confirming") && (
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
          )}
          {step === "success" && (
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          )}
          {step === "error" && (
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <XCircle className="w-7 h-7" />
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2">
          {step === "preparing" && "Preparing Transaction..."}
          {step === "awaiting_wallet" && "Confirm in Wallet"}
          {step === "pending" && "Submitting Transaction..."}
          {step === "confirming" && "Confirming on Botchain..."}
          {step === "success" && successTitle}
          {step === "error" && "Transaction Failed"}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-300 mb-6">
          {step === "preparing" && "Validating parameters and simulating execution..."}
          {step === "awaiting_wallet" && "Please review and approve the transaction prompt in your connected wallet."}
          {step === "pending" && "Broadcasting transaction to Botchain nodes..."}
          {step === "confirming" && "Waiting for block confirmation and receipt..."}
          {step === "success" && successDescription}
          {step === "error" && (errorMessage || "An error occurred during transaction execution.")}
        </p>

        {/* Explorer Link */}
        {hash && (
          <div className="mb-6 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
            <div className="text-xs text-slate-400 mb-1">Transaction Hash:</div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-indigo-300 truncate max-w-[260px]">
                {hash}
              </span>
              <a
                href={`${BOTCHAIN_EXPLORER_URL}/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors shrink-0"
              >
                <span>Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Actions */}
        {(step === "success" || step === "error") && onClose && (
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-sm bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:from-indigo-500 hover:to-cyan-500 transition-all shadow-lg shadow-indigo-500/20"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
