"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BOTDAO_ABI, BOTDAO_CONTRACT_ADDRESS, RawProposal, computeProposalStatus } from "@/contracts/botdao";
import { BOTCHAIN_CHAIN_ID } from "@/lib/config";
import { formatBOT } from "@/lib/format";
import { ThumbsUp, ThumbsDown, CheckCircle2, AlertCircle, Play, Ban, ShieldCheck, Loader2 } from "lucide-react";
import { TransactionStatus, TxStep } from "./TransactionStatus";

interface Props {
  proposal: RawProposal;
  quorumVotes?: bigint;
  onRefresh?: () => void;
}

export function VotePanel({ proposal, quorumVotes = BigInt(2), onRefresh }: Props) {
  const { address, isConnected } = useAccount();
  const [txStep, setTxStep] = useState<TxStep>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successInfo, setSuccessInfo] = useState({ title: "", description: "" });

  const status = computeProposalStatus(proposal, quorumVotes);

  // Check if current user has already voted
  const { data: userVoted, refetch: refetchVoted } = useReadContract({
    address: BOTDAO_CONTRACT_ADDRESS,
    abi: BOTDAO_ABI,
    functionName: "hasUserVoted",
    args: [proposal.id, (address || "0x0000000000000000000000000000000000000000") as `0x${string}`],
    chainId: BOTCHAIN_CHAIN_ID,
    query: {
      enabled: Boolean(BOTDAO_CONTRACT_ADDRESS && address),
    },
  });

  // Check if proposal passed on-chain
  const { data: passedOnChain, refetch: refetchPassed } = useReadContract({
    address: BOTDAO_CONTRACT_ADDRESS,
    abi: BOTDAO_ABI,
    functionName: "proposalPassed",
    args: [proposal.id],
    chainId: BOTCHAIN_CHAIN_ID,
    query: {
      enabled: Boolean(BOTDAO_CONTRACT_ADDRESS),
    },
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
      refetchVoted();
      refetchPassed();
      if (onRefresh) onRefresh();
    }
  }, [isWaitingReceipt, isConfirmed, refetchVoted, refetchPassed, onRefresh]);

  const handleVote = async (support: boolean) => {
    if (!isConnected || !address) {
      setErrorMessage("Please connect your wallet to vote.");
      setTxStep("error");
      return;
    }

    try {
      setTxStep("awaiting_wallet");
      setErrorMessage("");
      setSuccessInfo({
        title: "Vote Cast Successfully!",
        description: `You have voted ${support ? "FOR" : "AGAINST"} Proposal #${proposal.id}.`,
      });

      await writeContractAsync({
        address: BOTDAO_CONTRACT_ADDRESS,
        abi: BOTDAO_ABI,
        functionName: "vote",
        args: [proposal.id, support],
      });

      setTxStep("pending");
    } catch (err: any) {
      console.error("Vote error:", err);
      setErrorMessage(err?.shortMessage || err?.message || "Failed to submit vote.");
      setTxStep("error");
    }
  };

  const handleExecute = async () => {
    if (!isConnected) {
      setErrorMessage("Please connect your wallet to execute.");
      setTxStep("error");
      return;
    }

    try {
      setTxStep("awaiting_wallet");
      setErrorMessage("");
      setSuccessInfo({
        title: "Proposal Executed!",
        description: `Successfully executed proposal #${proposal.id} and transferred ${formatBOT(proposal.amount)} BOT to ${proposal.recipient}.`,
      });

      await writeContractAsync({
        address: BOTDAO_CONTRACT_ADDRESS,
        abi: BOTDAO_ABI,
        functionName: "executeProposal",
        args: [proposal.id],
      });

      setTxStep("pending");
    } catch (err: any) {
      console.error("Execute error:", err);
      setErrorMessage(err?.shortMessage || err?.message || "Failed to execute proposal.");
      setTxStep("error");
    }
  };

  const handleCancel = async () => {
    if (!isConnected) {
      setErrorMessage("Please connect your wallet.");
      setTxStep("error");
      return;
    }

    try {
      setTxStep("awaiting_wallet");
      setErrorMessage("");
      setSuccessInfo({
        title: "Proposal Canceled",
        description: `Proposal #${proposal.id} has been canceled by the proposer.`,
      });

      await writeContractAsync({
        address: BOTDAO_CONTRACT_ADDRESS,
        abi: BOTDAO_ABI,
        functionName: "cancelProposal",
        args: [proposal.id],
      });

      setTxStep("pending");
    } catch (err: any) {
      console.error("Cancel error:", err);
      setErrorMessage(err?.shortMessage || err?.message || "Failed to cancel proposal.");
      setTxStep("error");
    }
  };

  const isProposer = address?.toLowerCase() === proposal.proposer.toLowerCase();
  const hasUserAlreadyVoted = Boolean(userVoted);
  const isPassedOnChain = Boolean(passedOnChain);
  const canExecute = (status === "Passed" || isPassedOnChain) && !proposal.executed && !proposal.canceled;

  return (
    <>
      <div className="glass-panel rounded-2xl p-6 border border-indigo-500/20 shadow-glass space-y-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            Governance Action Panel
          </h3>
          <p className="text-xs text-slate-400">
            One wallet = One vote on-chain democracy model.
          </p>
        </div>

        {/* Voting State */}
        {status === "Voting" && (
          <div className="space-y-4">
            {hasUserAlreadyVoted ? (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3 text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-semibold text-xs text-white">Vote Recorded</div>
                  <div className="text-[11px] text-emerald-400/90">
                    You have already cast your vote on this proposal with this wallet.
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-xs font-semibold text-slate-300 mb-3">Cast Your Vote:</div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleVote(true)}
                    disabled={!isConnected}
                    className="py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 disabled:opacity-50"
                  >
                    <ThumbsUp className="w-4 h-4 text-emerald-400" />
                    <span>Vote FOR</span>
                  </button>

                  <button
                    onClick={() => handleVote(false)}
                    disabled={!isConnected}
                    className="py-3 px-4 rounded-xl font-bold text-xs bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 hover:border-rose-500/50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/10 disabled:opacity-50"
                  >
                    <ThumbsDown className="w-4 h-4 text-rose-400" />
                    <span>Vote AGAINST</span>
                  </button>
                </div>
                {!isConnected && (
                  <p className="text-[11px] text-amber-400/90 mt-2 text-center">
                    Connect wallet to participate in voting.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Execution State */}
        {canExecute && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-indigo-950/40 border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Proposal Passed On-Chain!</span>
            </div>
            <p className="text-xs text-slate-300">
              Voting has ended, quorum is met, and FOR votes won. Anyone can execute this proposal to trigger the treasury payout of {formatBOT(proposal.amount)} BOT.
            </p>
            <button
              onClick={handleExecute}
              disabled={!isConnected}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Execute Proposal & Transfer Funds</span>
            </button>
          </div>
        )}

        {/* Already Executed State */}
        {proposal.executed && (
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-300 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="font-bold text-xs text-white">Proposal Executed ✓</div>
              <div className="text-[11px] text-cyan-400/90">
                {formatBOT(proposal.amount)} BOT has been transferred to recipient.
              </div>
            </div>
          </div>
        )}

        {/* Proposer Cancellation Option */}
        {isProposer && !proposal.executed && !proposal.canceled && (
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-300">Proposer Controls:</span>
                <p className="text-[11px] text-slate-500">You created this proposal and can cancel it.</p>
              </div>
              <button
                onClick={handleCancel}
                disabled={!isConnected}
                className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 transition-all flex items-center gap-1.5"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <TransactionStatus
        step={txStep}
        hash={txHash}
        errorMessage={errorMessage}
        successTitle={successInfo.title}
        successDescription={successInfo.description}
        onClose={() => setTxStep("idle")}
      />
    </>
  );
}
