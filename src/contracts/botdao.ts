import BotDAOArtifact from "./BotDAO.json";
import { Abi } from "viem";

export const BOTDAO_CONTRACT_ADDRESS = ((process.env.NEXT_PUBLIC_BOTDAO_CONTRACT_ADDRESS || "0x8e0FC0fAe92E70D83fC6Bdf0a124057394A0dA57").trim()) as `0x${string}`;

export const BOTDAO_ABI = BotDAOArtifact.abi as Abi;

export interface RawProposal {
  id: bigint;
  proposer: string;
  recipient: string;
  amount: bigint;
  description: string;
  startTime: bigint;
  endTime: bigint;
  forVotes: bigint;
  againstVotes: bigint;
  executed: boolean;
  canceled: boolean;
}

export type ProposalStatusType = "Voting" | "Passed" | "Rejected" | "Executed" | "Canceled";

export function computeProposalStatus(
  proposal: RawProposal,
  quorumVotes: bigint = BigInt(2)
): ProposalStatusType {
  if (proposal.canceled) return "Canceled";
  if (proposal.executed) return "Executed";

  const nowSec = BigInt(Math.floor(Date.now() / 1000));
  if (nowSec <= proposal.endTime) {
    return "Voting";
  }

  // Voting ended
  const totalVotes = proposal.forVotes + proposal.againstVotes;
  if (totalVotes >= quorumVotes && proposal.forVotes > proposal.againstVotes) {
    return "Passed";
  }

  return "Rejected";
}
