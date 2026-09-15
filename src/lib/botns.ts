/**
 * BotNS (Bot Name Service) Integration Module
 * 
 * Provides an architectural abstraction layer for resolving Botchain addresses
 * to .bot domain names (e.g. alex.bot) once the BotNS registry contract is deployed.
 */

export interface BotNSProfile {
  address: string;
  name: string | null;
  avatarUrl?: string | null;
}

/**
 * Resolve a Botchain address to a BotNS name.
 * Currently returns null (fallback to formatted address) until BotNS registry is connected.
 * Prepared for plug-and-play RPC / Contract lookup without breaking frontend components.
 */
export async function resolveBotNS(address?: string): Promise<string | null> {
  if (!address) return null;
  
  // Future implementation:
  // const botnsContract = getBotNSContract();
  // return await botnsContract.getNameByAddress(address);
  
  return null;
}

/**
 * Helper hook / formatting wrapper for BotNS display
 */
export function formatAddressOrBotNS(address?: string, botnsName?: string | null): string {
  if (botnsName) return botnsName;
  if (!address) return "";
  if (address.length <= 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}
