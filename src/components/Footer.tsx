"use client";

import React from "react";
import Link from "next/link";
import { Shield, ExternalLink, Globe, Code2, Sparkles } from "lucide-react";
import { BOTCHAIN_EXPLORER_URL, BOTCHAIN_RPC_URL } from "@/lib/config";
import { BOTDAO_CONTRACT_ADDRESS } from "@/contracts/botdao";

export function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/80 mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm text-white tracking-wider">BOTDAO</span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Govern Together. Build On-Chain. A decentralized community treasury where members propose, vote, and execute fund allocations on Botchain Testnet.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold border border-indigo-500/20">
                <Sparkles className="w-3 h-3" /> MVP Governance: 1 Wallet = 1 Vote
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Navigation</h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/dashboard" className="hover:text-indigo-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/proposals" className="hover:text-indigo-400 transition-colors">
                  All Proposals
                </Link>
              </li>
              <li>
                <Link href="/create-proposal" className="hover:text-indigo-400 transition-colors">
                  Create Proposal
                </Link>
              </li>
              <li>
                <Link href="/treasury" className="hover:text-indigo-400 transition-colors">
                  Treasury Vault
                </Link>
              </li>
            </ul>
          </div>

          {/* Network Info */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Network & Links</h4>
            <ul className="space-y-1.5">
              <li>
                <a
                  href={BOTCHAIN_EXPLORER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-indigo-400 transition-colors"
                >
                  <span>Bohr Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="text-slate-500">Chain ID: <span className="text-slate-300 font-mono">968</span></span>
              </li>
              <li>
                <span className="text-slate-500">RPC: <span className="text-slate-300 font-mono">bohr.life</span></span>
              </li>
              {BOTDAO_CONTRACT_ADDRESS && (
                <li>
                  <a
                    href={`${BOTCHAIN_EXPLORER_URL}/address/${BOTDAO_CONTRACT_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                  >
                    <span>DAO Contract</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} BotDAO. Built on Botchain & Bohr Testnet. All actions executed on-chain.
          </p>
          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <span>Decentralized Treasury</span>
            <span>•</span>
            <span>Non-Custodial</span>
            <span>•</span>
            <span>BotNS Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
