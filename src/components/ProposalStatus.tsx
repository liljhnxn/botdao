"use client";

import React from "react";
import { ProposalStatusType } from "@/contracts/botdao";
import { CheckCircle2, XCircle, Clock, CheckCheck, Ban } from "lucide-react";

interface Props {
  status: ProposalStatusType;
  size?: "sm" | "md" | "lg";
}

export function ProposalStatus({ status, size = "md" }: Props) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs font-medium gap-1.5",
    lg: "px-3 py-1.5 text-sm font-semibold gap-2",
  };

  const statusStyles: Record<
    ProposalStatusType,
    { bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    Voting: {
      bg: "bg-indigo-500/10",
      text: "text-indigo-400",
      border: "border-indigo-500/30",
      icon: <Clock className="w-3.5 h-3.5 animate-pulse" />,
    },
    Passed: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    Rejected: {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/30",
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
    Executed: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      border: "border-cyan-500/30",
      icon: <CheckCheck className="w-3.5 h-3.5" />,
    },
    Canceled: {
      bg: "bg-slate-500/10",
      text: "text-slate-400",
      border: "border-slate-500/30",
      icon: <Ban className="w-3.5 h-3.5" />,
    },
  };

  const config = statusStyles[status] || statusStyles.Voting;

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      {config.icon}
      <span>{status}</span>
    </span>
  );
}
