"use client";

import React from "react";
import Link from "next/link";
import { 
  FileText, 
  Printer, 
  ExternalLink, 
  ShieldCheck, 
  Coins, 
  Vote, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  Copy,
  Sparkles
} from "lucide-react";
import { BOTCHAIN_CHAIN_ID, BOTCHAIN_RPC_URL, BOTCHAIN_EXPLORER_URL } from "@/lib/config";
import { BOTDAO_CONTRACT_ADDRESS } from "@/contracts/botdao";

export default function WhitepaperPage() {
  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Document link copied to clipboard!");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Banner with Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-xl print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">BotDAO Official Whitepaper & Pitch Deck</h2>
            <p className="text-xs text-slate-400">Ready for Hackathon & Grant Submissions</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </button>

          <a
            href={`${BOTCHAIN_EXPLORER_URL}/address/${BOTDAO_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/50 transition-all"
          >
            <span>Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Cover / Title Card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 uppercase tracking-widest mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Protocol Specification v1.0
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
          BOTDAO
        </h1>
        <p className="text-lg sm:text-xl font-medium text-slate-300 max-width-2xl mb-8">
          Decentralized Community Governance & Treasury Infrastructure on Botchain
        </p>

        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          A non-custodial decentralized autonomous organization (DAO) designed for transparent resource pooling, community-driven grant proposals, democratic 1-wallet-1-vote decision making, and trustless on-chain fund disbursements on Botchain.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800/80">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Protocol Version</div>
            <div className="text-sm font-bold text-white mt-1">v1.0 (Live Mainnet)</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Network</div>
            <div className="text-sm font-bold text-white mt-1">Botchain Mainnet (ID: {BOTCHAIN_CHAIN_ID})</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Currency</div>
            <div className="text-sm font-bold text-white mt-1">BOT (Native 18 Dec)</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Contract</div>
            <div className="text-xs font-mono text-cyan-400 mt-1 truncate" title={BOTDAO_CONTRACT_ADDRESS}>
              {BOTDAO_CONTRACT_ADDRESS.slice(0, 6)}...{BOTDAO_CONTRACT_ADDRESS.slice(-4)}
            </div>
          </div>
        </div>
      </div>

      {/* 1. Executive Summary */}
      <section className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">01</div>
          <h2 className="text-xl font-bold text-white">Executive Summary</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Community grant pools and ecosystem development funds in emerging blockchain networks are traditionally managed through centralized multisigs or off-chain foundation discretion. This creates governance bottlenecks, lack of accountability, and single points of failure.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          <strong>BotDAO</strong> solves this by introducing a turnkey on-chain treasury and governance primitive. Community members pool native <code className="text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded">BOT</code> tokens into an immutable smart contract, submit funding proposals, vote transparently, and automatically trigger payouts once quorum and positive majority thresholds are satisfied.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <Lock className="w-5 h-5 text-indigo-400 mb-2" />
            <h3 className="text-sm font-bold text-white mb-1">100% Non-Custodial</h3>
            <p className="text-xs text-slate-400">Zero admin backdoors. Treasury funds leave strictly through approved community proposals.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <Vote className="w-5 h-5 text-cyan-400 mb-2" />
            <h3 className="text-sm font-bold text-white mb-1">1-Wallet = 1-Vote</h3>
            <p className="text-xs text-slate-400">Transparent on-chain voting with smart contract prevention against double voting.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <Coins className="w-5 h-5 text-emerald-400 mb-2" />
            <h3 className="text-sm font-bold text-white mb-1">Trustless Execution</h3>
            <p className="text-xs text-slate-400">Anyone can trigger execution. Approved funds transfer directly to the recipient.</p>
          </div>
        </div>
      </section>

      {/* 2. Problem & Solution */}
      <section className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">02</div>
          <h2 className="text-xl font-bold text-white">Problem Statement & Market Need</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-800/30">
            <h3 className="text-sm font-bold text-rose-400 mb-3">The Problem</h3>
            <ul className="text-xs text-slate-300 space-y-2.5 list-disc list-inside">
              <li>Centralized custodians hold community grants, creating counterparty risk.</li>
              <li>Existing DAO frameworks are heavy, gas-costly, and absent on Botchain.</li>
              <li>Token holders have zero real-time visibility into balances or approvals.</li>
            </ul>
          </div>
          <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-800/30">
            <h3 className="text-sm font-bold text-emerald-400 mb-3">The BotDAO Solution</h3>
            <ul className="text-xs text-slate-300 space-y-2.5 list-disc list-inside">
              <li>Autonomous smart contract vault with instant on-chain balance tracking.</li>
              <li>Lightweight, intuitive UI tailored for Botchain RPC and Explorer.</li>
              <li>Guaranteed algorithmic payouts without intermediaries.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Workflow */}
      <section className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">03</div>
          <h2 className="text-xl font-bold text-white">Governance Lifecycle</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-bold text-indigo-400">1. Deposit</div>
            <div className="text-[11px] text-slate-400 mt-1">Native BOT vault</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-bold text-indigo-400">2. Propose</div>
            <div className="text-[11px] text-slate-400 mt-1">Grant request</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-bold text-indigo-400">3. Vote</div>
            <div className="text-[11px] text-slate-400 mt-1">FOR / AGAINST</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-bold text-indigo-400">4. Quorum</div>
            <div className="text-[11px] text-slate-400 mt-1">Majority check</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-bold text-emerald-400">5. Execute</div>
            <div className="text-[11px] text-slate-400 mt-1">BOT payout</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-200">
          <strong>Smart Contract Passing Condition:</strong> A proposal passes if and only if voting has ended (<code className="text-cyan-300">block.timestamp &gt;= endTime</code>), minimum quorum is achieved (<code className="text-cyan-300">forVotes + againstVotes &gt;= quorumVotes</code>), and in-favor votes exceed against votes (<code className="text-cyan-300">forVotes &gt; againstVotes</code>).
        </div>
      </section>

      {/* 4. Verified Deployment Details */}
      <section className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">04</div>
          <h2 className="text-xl font-bold text-white">Verified Deployment Details</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="py-2.5 font-semibold text-slate-400">Contract Address</td>
                <td className="py-2.5 font-mono text-cyan-400">{BOTDAO_CONTRACT_ADDRESS}</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-slate-400">Target Network</td>
                <td className="py-2.5">Botchain Mainnet (Chain ID {BOTCHAIN_CHAIN_ID})</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-slate-400">RPC Endpoint</td>
                <td className="py-2.5 font-mono">{BOTCHAIN_RPC_URL}</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-slate-400">Block Explorer</td>
                <td className="py-2.5 font-mono text-indigo-400">
                  <a href={`${BOTCHAIN_EXPLORER_URL}/address/${BOTDAO_CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer" className="underline hover:text-indigo-300">
                    {BOTCHAIN_EXPLORER_URL}/address/{BOTDAO_CONTRACT_ADDRESS}
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-slate-400">Security Architecture</td>
                <td className="py-2.5">OpenZeppelin ReentrancyGuard, Checks-Effects-Interactions, 100% Non-Custodial</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom CTA for Navigating the App */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30 text-center space-y-4 print:hidden">
        <h3 className="text-base font-bold text-white">Explore the Live BotDAO DApp</h3>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Connect your wallet on Botchain Mainnet to explore the live treasury, vote on proposals, or submit a funding request.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/treasury"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all"
          >
            <span>View Treasury</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
