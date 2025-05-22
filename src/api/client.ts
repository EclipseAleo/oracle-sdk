import { convertAddressToField } from '../utils/address';
import { parseAddress, parseBool, parseField, parseUint } from '../utils/parsing';

/**
 * Configuration options for the API client
 */
export interface ApiClientConfig {
  /**
   * Base URL for the Aleo Explorer API
   */
  baseUrl?: string;
  
  /**
   * Network to use (testnet or mainnet)
   */
  network?: 'testnet' | 'mainnet';
}

/**
 * Default configuration for the API client
 */
const DEFAULT_CONFIG: ApiClientConfig = {
  baseUrl: 'https://api.explorer.provable.com/v1',
  network: 'testnet',
};

/**
 * Client for interacting with Aleo contracts via the Explorer API
 */
export class AleoExplorerClient {
  private baseUrl: string;
  private network: string;

  /**
   * Creates a new instance of the AleoExplorerClient
   * 
   * @param config Configuration options
   */
  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || DEFAULT_CONFIG.baseUrl!;
    this.network = config.network || DEFAULT_CONFIG.network!;
  }

  /**
   * Fetches data from the API
   * 
   * @param endpoint API endpoint
   * @returns Response data as text
   */
  private async fetchData(endpoint: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.network}/${endpoint}`);
      if (!response.ok) return null;
      return await response.text();
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }

  /**
   * Fetches a mapping value from a contract
   * 
   * @param program Program name
   * @param mapping Mapping name
   * @param key Key to look up
   * @returns Mapping value as text
   */
  async getMappingValue(program: string, mapping: string, key: string): Promise<string | null> {
    return this.fetchData(`program/${program}/mapping/${mapping}/${key}`);
  }

  /**
   * Gets a feed provider list
   * 
   * @param feedId ID of the feed
   * @param maxProviders Maximum number of providers to fetch
   * @returns Array of provider addresses
   */
  async getFeedProviders(feedId: string, maxProviders = 8): Promise<string[]> {
    const providerRequests = Array.from({ length: maxProviders }, (_, i) =>
      this.getMappingValue(
        'eclipse_oracle_staking_2.aleo',
        'provider_list',
        `${Number(feedId) + i}field`
      ).then(raw => parseAddress(raw))
    );
    
    const addresses = (await Promise.all(providerRequests)).filter(Boolean) as string[];
    return addresses;
  }

  /**
   * Gets the stake amount for a provider in a feed
   * 
   * @param address Provider address
   * @param feedId Feed ID
   * @returns Stake amount (in credits)
   */
  async getProviderStake(address: string, feedId: string): Promise<number> {
    const key = (convertAddressToField(address) + BigInt(feedId)).toString();
    const raw = await this.getMappingValue(
      'eclipse_oracle_staking_2.aleo',
      'stakes',
      `${key}field`
    );
    return parseUint(raw, 'u128');
  }

  /**
   * Gets the proposed price for a provider in a feed
   * 
   * @param address Provider address
   * @param feedId Feed ID
   * @returns Proposed price or null if no proposal
   */
  async getProviderProposedPrice(address: string, feedId: string): Promise<number | null> {
    const key = (convertAddressToField(address) + BigInt(feedId)).toString();
    const raw = await this.getMappingValue(
      'eclipse_oracle_submit_2.aleo',
      'temp_price',
      `${key}field`
    );
    return raw ? parseUint(raw, 'u128') / 1e6 : null;
  }

  /**
   * Gets the total staked amount for a feed
   * 
   * @param feedId Feed ID
   * @returns Total staked amount
   */
  async getTotalStaked(feedId: string): Promise<number> {
    const raw = await this.getMappingValue(
      'eclipse_oracle_staking_2.aleo',
      'total_staked',
      `${feedId}field`
    );
    return parseUint(raw, 'u128');
  }

  /**
   * Gets the current price for a feed
   * 
   * @param feedId Feed ID
   * @returns Current price or null if not available
   */
  async getCurrentPrice(feedId: string): Promise<number | null> {
    const raw = await this.getMappingValue(
      'eclipse_oracle_aggregate_2.aleo',
      'latest_price',
      `${feedId}field`
    );
    return raw ? parseUint(raw, 'u128') / 1e6 : null;
  }

  /**
   * Gets configuration information for a feed
   * 
   * @param feedId Feed ID
   * @returns Feed configuration information
   */
  async getFeedInfo(feedId: string): Promise<{
    creator: string;
    min_stake: number;
    slashing_threshold: number;
    aggregation_window: number;
    challenge_window: number;
    paused: boolean;
  } | null> {
    const raw = await this.getMappingValue(
      'eclipse_oracle_feed.aleo',
      'feeds',
      `${feedId}field`
    );
    
    if (!raw) return null;
    
    const creator = raw.match(/creator:\s*([a-z0-9]+)/)?.[1] ?? '';
    const min_stake = parseUint(raw, 'u64');
    const slashing_threshold = parseUint(raw?.split('slashing_threshold:')[1], 'u64');
    const aggregation_window = parseUint(raw, 'u32');
    const challenge_window = parseUint(raw?.split('challenge_window:')[1], 'u32');
    const paused = (raw.match(/paused:\s*(true|false)/)?.[1] ?? 'false') === 'true';
    
    return {
      creator,
      min_stake,
      slashing_threshold,
      aggregation_window,
      challenge_window,
      paused,
    };
  }

  /**
   * Gets the count of providers for a feed
   * 
   * @param feedId Feed ID
   * @returns Provider count
   */
  async getProviderCount(feedId: string): Promise<number | null> {
    const raw = await this.getMappingValue(
      'eclipse_oracle_staking_2.aleo',
      'provider_count',
      `${feedId}field`
    );
    return parseField(raw);
  }

  /**
   * Gets the proposal median for a feed
   * 
   * @param feedId Feed ID
   * @returns Proposal median or null if not available
   */
  async getProposalMedian(feedId: string): Promise<number | null> {
    const raw = await this.getMappingValue(
      'eclipse_oracle_aggregate_2.aleo',
      'proposal_median',
      `${feedId}field`
    );
    return raw ? parseField(raw) ? parseField(raw)! / 1e6 : null : null;
  }

  /**
   * Gets the proposal proposer for a feed
   * 
   * @param feedId Feed ID
   * @returns Proposer address or null if not available
   */
  async getProposalProposer(feedId: string): Promise<string | null> {
    const raw = await this.getMappingValue(
      'eclipse_oracle_aggregate_2.aleo',
      'proposal_proposer',
      `${feedId}field`
    );
    return parseAddress(raw);
  }

  /**
   * Gets the proposal block for a feed
   * 
   * @param feedId Feed ID
   * @returns Proposal block number or null if not available
   */
  async getProposalBlock(feedId: string): Promise<number | null> {
    const raw = await this.getMappingValue(
      'eclipse_oracle_aggregate_2.aleo',
      'proposal_block',
      `${feedId}field`
    );
    return parseField(raw);
  }

  /**
   * Checks if the proposal was slashed for a feed
   * 
   * @param feedId Feed ID
   * @returns True if slashed, false if not, null if not available
   */
  async getProposalSlashed(feedId: string): Promise<boolean | null> {
    const raw = await this.getMappingValue(
      'eclipse_oracle_aggregate_2.aleo',
      'proposal_slashed',
      `${feedId}field`
    );
    return parseBool(raw);
  }

  /**
   * Checks if the aggregate is done for a feed
   * 
   * @param feedId Feed ID
   * @returns True if done, false if not, null if not available
   */
  async getAggregateDone(feedId: string): Promise<boolean | null> {
    const raw = await this.getMappingValue(
      'eclipse_oracle_aggregate_2.aleo',
      'aggregate_done',
      `${feedId}field`
    );
    return parseBool(raw);
  }

  /**
   * Gets the slasher for a feed
   * 
   * @param feedId Feed ID
   * @returns Slasher address or null if not available
   */
  async getSlasher(feedId: string): Promise<string | null> {
    const raw = await this.getMappingValue(
      'eclipse_oracle_aggregate_2.aleo',
      'slasher',
      `${feedId}field`
    );
    return parseAddress(raw);
  }

  /**
   * Gets the slasher reward for a feed
   * 
   * @param feedId Feed ID
   * @returns Slasher reward or null if not available
   */
  async getSlasherReward(feedId: string): Promise<number | null> {
    const raw = await this.getMappingValue(
      'eclipse_oracle_aggregate_2.aleo',
      'slasher_reward',
      `${feedId}field`
    );
    return parseField(raw);
  }

  /**
   * Gets the last propose block for a feed
   * 
   * @param feedId Feed ID
   * @returns Last propose block number or null if not available
   */
  async getLastProposeBlock(feedId: string): Promise<number | null> {
    const raw = await this.getMappingValue(
      'eclipse_oracle_aggregate_2.aleo',
      'last_propose_block',
      `${feedId}field`
    );
    return parseField(raw);
  }
} 