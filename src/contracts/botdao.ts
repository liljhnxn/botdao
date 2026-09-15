import BotDAOArtifact from "./BotDAO.json";
import { Abi } from "viem";

export const BOTDAO_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_BOTDAO_CONTRACT_ADDRESS || "0x0E88F330627423a40947378bb91EF3215707cCfa") as `0x${string}`;

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
