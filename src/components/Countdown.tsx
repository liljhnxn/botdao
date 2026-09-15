"use client";

import React, { useEffect, useState } from "react";
import { formatTimeRemaining } from "@/lib/format";
import { Clock } from "lucide-react";

interface Props {
  endTimeSec: bigint | number;
  onEnd?: () => void;
}

export function Countdown({ endTimeSec, onEnd }: Props) {
  const [timeLeft, setTimeLeft] = useState(() => formatTimeRemaining(endTimeSec));

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = formatTimeRemaining(endTimeSec);
      setTimeLeft(updated);
      if (updated.isEnded && onEnd) {
        onEnd();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTimeSec, onEnd]);

  if (timeLeft.isEnded) {
    return (
      <span className="text-slate-400 font-medium inline-flex items-center gap-1.5 text-xs">
        <Clock className="w-3.5 h-3.5 text-slate-500" />
        Voting ended
      </span>
    );
  }

  return (
    <span className="text-indigo-300 font-medium inline-flex items-center gap-1.5 text-xs bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/20">
      <Clock className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
      Ends in: <span className="font-mono text-indigo-200">{timeLeft.formatted}</span>
    </span>
  );
}
