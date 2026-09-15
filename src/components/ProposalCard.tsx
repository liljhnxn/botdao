"use client";

import React from "react";
import Link from "next/link";
import { RawProposal, computeProposalStatus } from "@/contracts/botdao";
import { formatAddress, formatBOT } from "@/lib/format";
import { ProposalStatus } from "./ProposalStatus";
import { Countdown } from "./Countdown";
import { ArrowRight, User, Wallet, Check, X, ShieldAlert } from "lucide-react";

interface Props {
  proposal: RawProposal;
  quorumVotes?: bigint;
}

export function ProposalCard({ proposal, quorumVotes = BigInt(2) }: Props) {
  const status = computeProposalStatus(proposal, quorumVotes);

  const forVotesNum = Number(proposal.forVotes);
  const againstVotesNum = Number(proposal.againstVotes);
  const totalVotes = forVotesNum + againstVotesNum;

  const forPercent = totalVotes > 0 ? Math.round((forVotesNum / totalVotes) * 100) : 0;
  const againstPercent = totalVotes > 0 ? Math.round((againstVotesNum / totalVotes) * 100) : 0;

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 sm:p-6 flex flex-col justify-between border border-slate-800 relative group overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />

      <div>
        {/* Header: ID + Status */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-500/20">
            Proposal #{proposal.id.toString().padStart(2, "0")}
          </span>
          <ProposalStatus status={status} size="sm" />
        </div>

        {/* Title / Description */}
        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 mb-3">
          {proposal.description}
        </h3>

        {/* Amount Requested */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-4">
          <span className="text-xs text-slate-400 font-medium">Requested Funding</span>
          <div className="text-right">
            <span className="text-sm sm:text-base font-extrabold text-white">
              {formatBOT(proposal.amount)}
            </span>
            <span className="text-xs font-bold text-indigo-400 ml-1">BOT</span>
          </div>
        </div>

        {/* Voting Progress Bar & Stats */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Check className="w-3.5 h-3.5" /> FOR: {forVotesNum} ({forPercent}%)
            </span>
            <span className="flex items-center gap-1 text-rose-400 font-semibold">
              <X className="w-3.5 h-3.5" /> AGAINST: {againstVotesNum} ({againstPercent}%)
            </span>
          </div>

          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${totalVotes === 0 ? 0 : forPercent}%` }}
            />
            <div
              className="bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
              style={{ width: `${totalVotes === 0 ? 0 : againstPercent}%` }}
            />
          </div>
        </div>

        {/* Recipient info */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
          <span className="flex items-center gap-1 text-slate-500">
            <Wallet className="w-3.5 h-3.5" /> Recipient:
          </span>
          <span className="font-mono text-slate-300">{formatAddress(proposal.recipient)}</span>
        </div>
      </div>

      {/* Footer: Countdown & Action */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div>
          {status === "Voting" ? (
            <Countdown endTimeSec={proposal.endTime} />
          ) : (
            <span className="text-xs text-slate-400">
              {status === "Executed" && "Funds Distributed"}
              {status === "Passed" && "Ready for Execution"}
              {status === "Rejected" && "Failed Quorum/Votes"}
              {status === "Canceled" && "Canceled by Proposer"}
            </span>
          )}
        </div>

        <Link
          href={`/proposals/${proposal.id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white border border-indigo-500/30 transition-all group-hover:translate-x-0.5"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
