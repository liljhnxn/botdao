"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useReadContract } from "wagmi";
import { BOTDAO_ABI, BOTDAO_CONTRACT_ADDRESS, RawProposal, computeProposalStatus } from "@/contracts/botdao";
import { formatAddress, formatBOT, formatDate } from "@/lib/format";
import { BOTCHAIN_EXPLORER_URL } from "@/lib/config";
import { ProposalStatus } from "@/components/ProposalStatus";
import { Countdown } from "@/components/Countdown";
import { VotePanel } from "@/components/VotePanel";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Shield,
  User,
  Wallet,
  Check,
  X,
  Coins,
  Scale,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function ProposalDetailsPage() {
  const params = useParams();
  const proposalId = BigInt(params.id as string || "1");

  const { data: proposalData, isLoading, refetch } = useReadContract({
    address: BOTDAO_CONTRACT_ADDRESS,
    abi: BOTDAO_ABI,
    functionName: "getProposal",
    args: [proposalId],
  });

  const { data: quorumVotes } = useReadContract({
    address: BOTDAO_CONTRACT_ADDRESS,
    abi: BOTDAO_ABI,
    functionName: "quorumVotes",
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm">
        Fetching proposal details from Botchain...
      </div>
    );
  }

  const proposal = proposalData as RawProposal | undefined;

  if (!proposal || proposal.id === BigInt(0)) {
    return (
      <div className="glass-panel max-w-lg mx-auto rounded-2xl p-10 text-center border border-slate-800 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 mx-auto flex items-center justify-center text-slate-500">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
        </div>
        <h2 className="text-lg font-bold text-white">Proposal Not Found</h2>
        <p className="text-xs text-slate-400">
          Proposal #{proposalId.toString()} does not exist on the BotDAO contract.
        </p>
        <Link
          href="/proposals"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Proposals</span>
        </Link>
      </div>
    );
  }

  const status = computeProposalStatus(proposal, quorumVotes as bigint | undefined);
  const forVotesNum = Number(proposal.forVotes);
  const againstVotesNum = Number(proposal.againstVotes);
  const totalVotes = forVotesNum + againstVotesNum;
  const quorumNum = quorumVotes ? Number(quorumVotes) : 2;
  const quorumMet = totalVotes >= quorumNum;

  const forPercent = totalVotes > 0 ? Math.round((forVotesNum / totalVotes) * 100) : 0;
  const againstPercent = totalVotes > 0 ? Math.round((againstVotesNum / totalVotes) * 100) : 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/proposals"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Proposals</span>
        </Link>

        <ProposalStatus status={status} size="lg" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details, Timeline, Description, Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400">
              <span>Proposal #{proposal.id.toString().padStart(2, "0")}</span>
              <span>•</span>
              <span>Created {formatDate(proposal.startTime)}</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-snug">
              {proposal.description}
            </h1>

            {/* Requested Amount Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-cyan-950/40 border border-indigo-500/20 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-medium">Requested Amount</div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {formatBOT(proposal.amount)}{" "}
                  <span className="text-base font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    BOT
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium">Recipient Address</div>
                <a
                  href={`${BOTCHAIN_EXPLORER_URL}/address/${proposal.recipient}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-indigo-300 hover:text-indigo-200 inline-flex items-center gap-1 mt-1"
                >
                  <span>{formatAddress(proposal.recipient, 6)}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Voting Results & Quorum Tracker */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-400" />
                Voting Breakdown & Quorum
              </h2>
              <span className="text-xs text-slate-400">
                Total Votes: <strong className="text-white">{totalVotes}</strong>
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> FOR ({forVotesNum} votes • {forPercent}%)
                </span>
                <span className="text-rose-400 flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> AGAINST ({againstVotesNum} votes • {againstPercent}%)
                </span>
              </div>

              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
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

            {/* Quorum Progress */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Quorum Requirement:</span>
                <span className={`font-semibold ${quorumMet ? "text-emerald-400" : "text-amber-400"}`}>
                  {totalVotes} / {quorumNum} Votes ({quorumMet ? "Quorum Reached ✓" : "Quorum Pending"})
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${quorumMet ? "bg-emerald-500" : "bg-amber-500"}`}
                  style={{ width: `${Math.min(100, (totalVotes / quorumNum) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Timeline & Metadata */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Proposal Details & Metadata
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block mb-1">Proposer Address:</span>
                <a
                  href={`${BOTCHAIN_EXPLORER_URL}/address/${proposal.proposer}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-indigo-300 hover:text-indigo-200 inline-flex items-center gap-1 font-medium"
                >
                  <span>{formatAddress(proposal.proposer, 6)}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block mb-1">Voting Window:</span>
                <div className="text-white font-medium">
                  {formatDate(proposal.startTime)} → {formatDate(proposal.endTime)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Voting Panel & Action Trigger */}
        <div className="space-y-6">
          <VotePanel
            proposal={proposal}
            quorumVotes={quorumVotes as bigint | undefined}
            onRefresh={() => refetch()}
          />

          {/* Voting Rules Info Box */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 text-xs text-slate-400 space-y-3">
            <h4 className="text-white font-semibold flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-cyan-400" />
              On-Chain Passing Criteria
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-slate-400 text-[11px] leading-relaxed">
              <li>Voting duration has completed.</li>
              <li>Total votes cast ≥ {quorumNum} (Quorum).</li>
              <li>FOR votes exceed AGAINST votes.</li>
              <li>Proposal is not canceled by proposer.</li>
              <li>Treasury holds sufficient BOT balance.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
