"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain, useChainId } from "wagmi";
import { BOTCHAIN_CHAIN_ID } from "@/lib/config";
import { formatAddress, formatBOT } from "@/lib/format";
import { Wallet, AlertCircle, ChevronDown, LogOut, ArrowRightLeft, ExternalLink, ShieldCheck } from "lucide-react";
import { BOTCHAIN_EXPLORER_URL } from "@/lib/config";

export function WalletButton() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const { data: balanceData } = useBalance({
    address,
    chainId: BOTCHAIN_CHAIN_ID,
  });

  const isWrongNetwork = isConnected && chainId !== BOTCHAIN_CHAIN_ID;

  if (isWrongNetwork) {
    return (
      <div className="relative">
        <button
          onClick={() => switchChain?.({ chainId: BOTCHAIN_CHAIN_ID })}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-all shadow-lg shadow-rose-500/10"
        >
          <AlertCircle className="w-4 h-4 animate-bounce" />
          <span>Switch to Botchain</span>
          <ArrowRightLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-indigo-500/20 hover:border-indigo-500/40 transition-all text-xs font-medium text-slate-200 shadow-glass"
        >
          {/* Status Dot */}
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

          {/* Balance */}
          <span className="font-semibold text-white">
            {formatBOT(balanceData?.value)} <span className="text-indigo-400 text-[10px]">BOT</span>
          </span>

          <div className="w-[1px] h-3.5 bg-slate-700" />

          {/* Address */}
          <span className="font-mono text-slate-300">{formatAddress(address)}</span>

          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {isDropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
            <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel p-3 shadow-2xl border border-indigo-500/20 z-50 text-xs animate-fadeIn">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 mb-2">
                <div className="text-[11px] text-slate-400">Connected Account</div>
                <div className="font-mono text-indigo-300 break-all font-medium mt-0.5">{address}</div>
                <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Balance:</span>
                  <span className="font-bold text-white">{formatBOT(balanceData?.value)} BOT</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Network:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Botchain (968)
                  </span>
                </div>
              </div>

              <a
                href={`${BOTCHAIN_EXPLORER_URL}/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-2 rounded-lg text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors mb-1"
                onClick={() => setIsDropdownOpen(false)}
              >
                <span>View on Explorer</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <button
                onClick={() => {
                  disconnect();
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <span>Disconnect Wallet</span>
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowConnectModal(true)}
        disabled={isConnecting}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
      >
        <Wallet className="w-4 h-4" />
        <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
      </button>

      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-indigo-500/20 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-indigo-400" />
                Connect Wallet
              </h3>
              <button
                onClick={() => setShowConnectModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Select a wallet provider to interact with the BotDAO treasury and cast on-chain votes on Botchain.
            </p>

            <div className="space-y-2">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => {
                    connect({ connector });
                    setShowConnectModal(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/30 text-white text-xs font-medium transition-all group"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform" />
                    {connector.name}
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-indigo-400 transition-colors">
                    Connect →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
