"use client";

import React from "react";
import Link from "next/link";
import { useReadContract } from "wagmi";
import { BOTDAO_ABI, BOTDAO_CONTRACT_ADDRESS, RawProposal, computeProposalStatus } from "@/contracts/botdao";
import { BOTCHAIN_CHAIN_ID } from "@/lib/config";
import { TreasuryCard } from "@/components/TreasuryCard";
import { ProposalCard } from "@/components/ProposalCard";
import { Vote, CheckCircle2, CheckCheck, PlusCircle, ArrowRight, Ban, Clock, Filter } from "lucide-react";

export default function DashboardPage() {
  const { data: rawProposals, isLoading, refetch } = useReadContract({
    address: BOTDAO_CONTRACT_ADDRESS,
    abi: BOTDAO_ABI,
    functionName: "getAllProposals",
    chainId: BOTCHAIN_CHAIN_ID,
    query: {
      enabled: Boolean(BOTDAO_CONTRACT_ADDRESS),
      refetchInterval: 4000,
    },
  });

  const { data: quorumVotes } = useReadContract({
    address: BOTDAO_CONTRACT_ADDRESS,
    abi: BOTDAO_ABI,
    functionName: "quorumVotes",
    chainId: BOTCHAIN_CHAIN_ID,
    query: {
      enabled: Boolean(BOTDAO_CONTRACT_ADDRESS),
    },
  });

  const proposals = (rawProposals as RawProposal[] | undefined) || [];

  const counts = proposals.reduce(
    (acc, p) => {
      const status = computeProposalStatus(p, quorumVotes as bigint | undefined);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { Voting: 0, Passed: 0, Rejected: 0, Executed: 0, Canceled: 0 } as Record<string, number>
  );

  return (
    <div className="space-y-10">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Governance Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Overview of community treasury, active voting sessions, and proposal execution.
          </p>
        </div>

        <Link
          href="/create-proposal"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Proposal</span>
        </Link>
      </div>

      {/* Treasury Card */}
      <TreasuryCard />

      {/* Quick Governance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-indigo-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Active Voting</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{counts.Voting}</div>
          <div className="text-[11px] text-indigo-400 mt-1">Accepting community votes</div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Passed Proposals</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{counts.Passed}</div>
          <div className="text-[11px] text-emerald-400 mt-1">Ready for execution</div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Executed Payouts</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <CheckCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{counts.Executed}</div>
          <div className="text-[11px] text-cyan-400 mt-1">Funds disbursed on-chain</div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Proposals</span>
            <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
              <Vote className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{proposals.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">All historical submissions</div>
        </div>
      </div>

      {/* Proposals Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Active & Recent Proposals</h2>
            <p className="text-xs text-slate-400">Review proposals and participate in governance.</p>
          </div>

          <Link
            href="/proposals"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
          >
            <span>View All ({proposals.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 text-slate-400 text-xs">
            Loading proposals from Botchain...
          </div>
        ) : proposals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...proposals].reverse().slice(0, 6).map((proposal) => (
              <ProposalCard
                key={proposal.id.toString()}
                proposal={proposal}
                quorumVotes={quorumVotes as bigint | undefined}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 mx-auto flex items-center justify-center text-slate-500">
              <Vote className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-white">No Proposals Found</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No governance proposals have been created yet on BotDAO.
            </p>
            <Link
              href="/create-proposal"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
            >
              <span>Create Proposal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
