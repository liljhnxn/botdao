"use client";

import React from "react";
import Link from "next/link";
import { useReadContract } from "wagmi";
import { BOTDAO_ABI, BOTDAO_CONTRACT_ADDRESS, RawProposal } from "@/contracts/botdao";
import { BOTCHAIN_CHAIN_ID } from "@/lib/config";
import { formatBOT } from "@/lib/format";
import { ProposalCard } from "@/components/ProposalCard";
import {
  Shield,
  Vote,
  Vault,
  Coins,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  Lock,
  Layers,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const { data: treasuryBalance } = useReadContract({
    address: BOTDAO_CONTRACT_ADDRESS,
    abi: BOTDAO_ABI,
    functionName: "getTreasuryBalance",
    chainId: BOTCHAIN_CHAIN_ID,
    query: { enabled: Boolean(BOTDAO_CONTRACT_ADDRESS), refetchInterval: 4000 },
  });

  const { data: proposalCount } = useReadContract({
    address: BOTDAO_CONTRACT_ADDRESS,
    abi: BOTDAO_ABI,
    functionName: "getProposalCount",
    chainId: BOTCHAIN_CHAIN_ID,
    query: { enabled: Boolean(BOTDAO_CONTRACT_ADDRESS), refetchInterval: 4000 },
  });

  const { data: quorumVotes } = useReadContract({
    address: BOTDAO_CONTRACT_ADDRESS,
    abi: BOTDAO_ABI,
    functionName: "quorumVotes",
    chainId: BOTCHAIN_CHAIN_ID,
    query: { enabled: Boolean(BOTDAO_CONTRACT_ADDRESS) },
  });

  const { data: rawProposals } = useReadContract({
    address: BOTDAO_CONTRACT_ADDRESS,
    abi: BOTDAO_ABI,
    functionName: "getAllProposals",
    chainId: BOTCHAIN_CHAIN_ID,
    query: { enabled: Boolean(BOTDAO_CONTRACT_ADDRESS), refetchInterval: 4000 },
  });

  const proposalsList = (rawProposals as RawProposal[] | undefined) || [];
  const totalCount = proposalCount ? Number(proposalCount) : proposalsList.length;

  const activeProposals = proposalsList.filter((p) => {
    const nowSec = BigInt(Math.floor(Date.now() / 1000));
    return !p.canceled && !p.executed && nowSec <= p.endTime;
  });

  const recentProposals = [...proposalsList].reverse().slice(0, 3);

  return (
    <div className="space-y-24 py-6 sm:py-12">
      {/* Hero Section */}
      <section className="relative text-center space-y-8 max-w-4xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Decentralized Governance on Botchain Testnet</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Govern Together. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Build On-Chain.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          A decentralized community treasury where users create proposals, vote on decisions, and execute approved payments entirely on-chain.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Launch App</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/treasury"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-indigo-500/40 transition-all flex items-center justify-center gap-2"
          >
            <Vault className="w-4 h-4 text-indigo-400" />
            <span>View Treasury</span>
          </Link>
        </div>
      </section>

      {/* Real Live Metrics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800 text-center relative overflow-hidden">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-indigo-400" /> DAO Treasury
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {formatBOT(treasuryBalance as bigint | undefined)} <span className="text-sm font-bold text-indigo-400">BOT</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Live smart contract balance</div>
        </div>

        <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800 text-center relative overflow-hidden">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <Vote className="w-3.5 h-3.5 text-cyan-400" /> Active Proposals
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {activeProposals.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Currently open for voting</div>
        </div>

        <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800 text-center relative overflow-hidden">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" /> Total Proposals
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {totalCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Submitted on-chain</div>
        </div>

        <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800 text-center relative overflow-hidden">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-pink-400" /> Quorum Requirement
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {quorumVotes ? Number(quorumVotes) : 2} <span className="text-sm font-bold text-pink-400">Votes</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Required to validate outcome</div>
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How BotDAO Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A transparent and decentralized 4-step governance lifecycle powered by smart contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-white mb-2">Fund Treasury</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Anyone can contribute native BOT tokens to the DAO treasury to build the community pool.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-white mb-2">Create Proposals</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit funding requests detailing recipient address, amount, description, and voting period.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-white mb-2">Vote On-Chain</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Community members cast FOR or AGAINST votes. One wallet equals one vote with double-voting prevention.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold mb-4">
              04
            </div>
            <h3 className="text-base font-bold text-white mb-2">Execute Payouts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Passed proposals meeting quorum can be executed by anyone to release treasury BOT directly to the recipient.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Proposals */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Recent Proposals</h2>
            <p className="text-xs text-slate-400 mt-1">Live governance requests from the smart contract</p>
          </div>
          <Link
            href="/proposals"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentProposals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentProposals.map((proposal) => (
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
            <div className="text-sm font-semibold text-white">No Proposals Created Yet</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Be the first to submit a community initiative and request treasury funds on Botchain.
            </p>
            <Link
              href="/create-proposal"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
            >
              <span>Create First Proposal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
