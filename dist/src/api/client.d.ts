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
 * Client for interacting with Aleo contracts via the Explorer API
 */
export declare class AleoExplorerClient {
    private baseUrl;
    private network;
    /**
     * Creates a new instance of the AleoExplorerClient
     *
     * @param config Configuration options
     */
    constructor(config?: ApiClientConfig);
    /**
     * Fetches data from the API
     *
     * @param endpoint API endpoint
     * @returns Response data as text
     */
    private fetchData;
    /**
     * Fetches a mapping value from a contract
     *
     * @param program Program name
     * @param mapping Mapping name
     * @param key Key to look up
     * @returns Mapping value as text
     */
    getMappingValue(program: string, mapping: string, key: string): Promise<string | null>;
    /**
     * Gets a feed provider list
     *
     * @param feedId ID of the feed
     * @param maxProviders Maximum number of providers to fetch
     * @returns Array of provider addresses
     */
    getFeedProviders(feedId: string, maxProviders?: number): Promise<string[]>;
    /**
     * Gets the stake amount for a provider in a feed
     *
     * @param address Provider address
     * @param feedId Feed ID
     * @returns Stake amount (in credits)
     */
    getProviderStake(address: string, feedId: string): Promise<number>;
    /**
     * Gets the proposed price for a provider in a feed
     *
     * @param address Provider address
     * @param feedId Feed ID
     * @returns Proposed price or null if no proposal
     */
    getProviderProposedPrice(address: string, feedId: string): Promise<number | null>;
    /**
     * Gets the total staked amount for a feed
     *
     * @param feedId Feed ID
     * @returns Total staked amount
     */
    getTotalStaked(feedId: string): Promise<number>;
    /**
     * Gets the current price for a feed
     *
     * @param feedId Feed ID
     * @returns Current price or null if not available
     */
    getCurrentPrice(feedId: string): Promise<number | null>;
    /**
     * Gets configuration information for a feed
     *
     * @param feedId Feed ID
     * @returns Feed configuration information
     */
    getFeedInfo(feedId: string): Promise<{
        creator: string;
        min_stake: number;
        slashing_threshold: number;
        aggregation_window: number;
        challenge_window: number;
        paused: boolean;
    } | null>;
    /**
     * Gets the count of providers for a feed
     *
     * @param feedId Feed ID
     * @returns Provider count
     */
    getProviderCount(feedId: string): Promise<number | null>;
    /**
     * Gets the proposal median for a feed
     *
     * @param feedId Feed ID
     * @returns Proposal median or null if not available
     */
    getProposalMedian(feedId: string): Promise<number | null>;
    /**
     * Gets the proposal proposer for a feed
     *
     * @param feedId Feed ID
     * @returns Proposer address or null if not available
     */
    getProposalProposer(feedId: string): Promise<string | null>;
    /**
     * Gets the proposal block for a feed
     *
     * @param feedId Feed ID
     * @returns Proposal block number or null if not available
     */
    getProposalBlock(feedId: string): Promise<number | null>;
    /**
     * Checks if the proposal was slashed for a feed
     *
     * @param feedId Feed ID
     * @returns True if slashed, false if not, null if not available
     */
    getProposalSlashed(feedId: string): Promise<boolean | null>;
    /**
     * Checks if the aggregate is done for a feed
     *
     * @param feedId Feed ID
     * @returns True if done, false if not, null if not available
     */
    getAggregateDone(feedId: string): Promise<boolean | null>;
    /**
     * Gets the slasher for a feed
     *
     * @param feedId Feed ID
     * @returns Slasher address or null if not available
     */
    getSlasher(feedId: string): Promise<string | null>;
    /**
     * Gets the slasher reward for a feed
     *
     * @param feedId Feed ID
     * @returns Slasher reward or null if not available
     */
    getSlasherReward(feedId: string): Promise<number | null>;
    /**
     * Gets the last propose block for a feed
     *
     * @param feedId Feed ID
     * @returns Last propose block number or null if not available
     */
    getLastProposeBlock(feedId: string): Promise<number | null>;
}
//# sourceMappingURL=client.d.ts.map