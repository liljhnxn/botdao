"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "./WalletButton";
import { Shield, Vote, LayoutDashboard, PlusCircle, Vault, Menu, X, Coins, FileText, ExternalLink, Globe } from "lucide-react";
import { BOTCHAIN_CHAIN_ID, BOTCHAIN_EXPLORER_URL } from "@/lib/config";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Proposals", href: "/proposals", icon: <Vote className="w-4 h-4" /> },
    { name: "Create Proposal", href: "/create-proposal", icon: <PlusCircle className="w-4 h-4" /> },
    { name: "Treasury", href: "/treasury", icon: <Vault className="w-4 h-4" /> },
    { name: "Whitepaper", href: "/whitepaper", icon: <FileText className="w-4 h-4" /> },
    { name: "botchain.ai", href: "https://botchain.ai", icon: <Globe className="w-3.5 h-3.5 text-cyan-400" />, isExternal: true },
    { name: "scan.botchain.ai", href: "https://scan.botchain.ai", icon: <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />, isExternal: true },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      {/* Official Botchain Verification Bar */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/20 px-4 py-1.5 text-center text-[11px] text-slate-300 flex items-center justify-center flex-wrap gap-x-4 gap-y-1">
        <span className="inline-flex items-center gap-1.5 font-medium text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Botchain Mainnet (Chain ID {BOTCHAIN_CHAIN_ID})</span>
        </span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="text-slate-400">Official Website:</span>
          <a
            href="https://botchain.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 font-semibold underline decoration-cyan-500/50 hover:decoration-cyan-400 inline-flex items-center gap-0.5 transition-colors"
          >
            <span>https://botchain.ai</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="text-slate-400">Block Explorer:</span>
          <a
            href="https://scan.botchain.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 font-semibold underline decoration-cyan-500/50 hover:decoration-cyan-400 inline-flex items-center gap-0.5 transition-colors"
          >
            <span>https://scan.botchain.ai</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-glow">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Shield className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                BOTDAO
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold tracking-widest text-cyan-400 uppercase px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">
                Governance
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.isExternal) {
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-300 hover:text-white hover:bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </a>
                );
              }
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-inner"
                      : "text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent"
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Area: Network badge & Wallet Button */}
          <div className="flex items-center gap-3">
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-400 hover:text-cyan-300 transition-all font-medium group"
              title="View Botchain Mainnet Block Explorer (https://scan.botchain.ai)"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Botchain {BOTCHAIN_CHAIN_ID}</span>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </a>
            <WalletButton />

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800/80 bg-slate-950/95 px-4 pt-3 pb-5 space-y-1.5 animate-fadeIn">
          {navLinks.map((link) => {
            if (link.isExternal) {
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-cyan-300 hover:text-white hover:bg-slate-900"
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    <span>{link.name}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                </a>
              );
            }
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-900"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
