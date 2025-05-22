/**
 * Types for Oracle data structures
 */

/**
 * Represents a price point in history
 */
export interface PricePoint {
  timestamp: string;
  price: number;
}

/**
 * Information about a feed's configuration
 */
export interface FeedInfo {
  creator: string;
  min_stake: number;
  slashing_threshold: number;
  aggregation_window: number;
  challenge_window: number;
  paused: boolean;
}

/**
 * Represents a data provider
 */
export interface Provider {
  address: string;
  stakedCredits: number;
  proposedPrice?: number | null;
}

/**
 * Represents an address that has been slashed
 */
export interface SlashedAddress {
  address: string;
  date: string;
}

/**
 * Represents a complete Oracle feed
 */
export interface Feed {
  id: string;
  name: string;
  infos: FeedInfo | null;
  totalStaked: number;
  submitters: Provider[];
  priceHistory: PricePoint[];
  slashedAddresses: SlashedAddress[];
  currentPrice: number | null;
  providerCount?: number;
  proposalMedian?: number | null;
  proposalProposer?: string | null;
  proposalBlock?: number | null;
  proposalSlashed?: boolean | null;
  aggregateDone?: boolean | null;
  slasher?: string | null;
  slasherReward?: number | null;
  lastProposeBlock?: number | null;
} 