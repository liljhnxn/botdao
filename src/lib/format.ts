import { formatEther, parseEther } from "viem";

export function formatAddress(address?: string, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 2) return address;
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function formatBOT(amountWei?: bigint | string | number, decimals = 4): string {
  if (amountWei === undefined || amountWei === null) return "0";
  try {
    const wei = typeof amountWei === "bigint" ? amountWei : BigInt(amountWei.toString());
    const formatted = formatEther(wei);
    const num = parseFloat(formatted);
    if (isNaN(num)) return "0";
    if (num === 0) return "0";
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    });
  } catch {
    return "0";
  }
}

export function parseBOT(amount: string): bigint {
  try {
    if (!amount || isNaN(Number(amount))) return BigInt(0);
    return parseEther(amount);
  } catch {
    return BigInt(0);
  }
}

export function formatDate(timestampSec: number | bigint): string {
  const ts = typeof timestampSec === "bigint" ? Number(timestampSec) : timestampSec;
  if (!ts || ts === 0) return "N/A";
  const date = new Date(ts * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTimeRemaining(endTimeSec: number | bigint): {
  isEnded: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
} {
  const end = typeof endTimeSec === "bigint" ? Number(endTimeSec) : endTimeSec;
  const now = Math.floor(Date.now() / 1000);
  const diff = end - now;

  if (diff <= 0) {
    return {
      isEnded: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: "Ended",
    };
  }

  const days = Math.floor(diff / (24 * 3600));
  const hours = Math.floor((diff % (24 * 3600)) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  let formatted = "";
  if (days > 0) {
    formatted = `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    formatted = `${hours}h ${minutes}m ${seconds}s`;
  } else {
    formatted = `${minutes}m ${seconds}s`;
  }

  return {
    isEnded: false,
    days,
    hours,
    minutes,
    seconds,
    formatted,
  };
}
