"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useReadContract } from "wagmi";
import { BOTDAO_ABI, BOTDAO_CONTRACT_ADDRESS, RawProposal, computeProposalStatus, ProposalStatusType } from "@/contracts/botdao";
import { ProposalCard } from "@/components/ProposalCard";
import { Vote, PlusCircle, Search, Filter } from "lucide-react";

export default function ProposalsPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: rawProposals, isLoading } = useReadContract({
    address: BOTDAO_CONTRACT_ADDRESS,
    abi: BOTDAO_ABI,
    functionName: "getAllProposals",
  });

  const { data: quorumVotes } = useReadContract({
    address: BOTDAO_CONTRACT_ADDRESS,
    abi: BOTDAO_ABI,
    functionName: "quorumVotes",
  });

  const proposals = (rawProposals as RawProposal[] | undefined) || [];

  const filterTabs = [
    { id: "All", label: "All Proposals" },
    { id: "Voting", label: "Voting Active" },
    { id: "Passed", label: "Passed" },
    { id: "Executed", label: "Executed" },
    { id: "Canceled", label: "Canceled" },
  ];

  const filteredProposals = proposals.filter((p) => {
    const status = computeProposalStatus(p, quorumVotes as bigint | undefined);

    if (selectedFilter !== "All" && status !== selectedFilter) {
      return false;
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchRecipient = p.recipient.toLowerCase().includes(q);
      const matchProposer = p.proposer.toLowerCase().includes(q);
      const matchId = p.id.toString().includes(q);
      return matchDesc || matchRecipient || matchProposer || matchId;
    }

    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            DAO Proposals
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse, vote, and monitor all on-chain funding requests on Botchain.
          </p>
        </div>

        <Link
          href="/create-proposal"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Proposal</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === tab.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search proposals, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Proposals Grid */}
      {isLoading ? (
        <div className="glass-panel rounded-2xl p-16 text-center border border-slate-800 text-slate-400 text-xs">
          Loading proposals from Botchain smart contract...
        </div>
      ) : filteredProposals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...filteredProposals].reverse().map((proposal) => (
            <ProposalCard
              key={proposal.id.toString()}
              proposal={proposal}
              quorumVotes={quorumVotes as bigint | undefined}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-16 text-center border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 mx-auto flex items-center justify-center text-slate-500">
            <Vote className="w-6 h-6" />
          </div>
          <div className="text-sm font-semibold text-white">No Proposals Match Your Criteria</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or filter selection.
          </p>
        </div>
      )}
    </div>
  );
}
