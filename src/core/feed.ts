import { AleoExplorerClient } from '../api/client';
import { Feed, FeedInfo, PricePoint, Provider, SlashedAddress } from '../types/feed';

/**
 * Default maximum number of providers to check
 */
const MAX_PROVIDERS = 8;

/**
 * Default average block time in seconds
 */
const AVERAGE_BLOCK_TIME_IN_SECONDS = 2;

/**
 * Feed service for retrieving complete feed data
 */
export class FeedService {
  private client: AleoExplorerClient;

  /**
   * Creates a new instance of the FeedService
   * 
   * @param client AleoExplorerClient instance or config
   */
  constructor(client?: AleoExplorerClient | { baseUrl?: string; network?: 'testnet' | 'mainnet' }) {
    if (client instanceof AleoExplorerClient) {
      this.client = client;
    } else {
      this.client = new AleoExplorerClient(client);
    }
  }

  /**
   * Gets complete data for a feed
   * 
   * @param feedId ID of the feed
   * @param maxProviders Maximum number of providers to check
   * @returns Complete feed data
   */
  async getFeedFullData(feedId: string, maxProviders = MAX_PROVIDERS): Promise<Feed> {
    // 1. Get provider addresses
    const addresses = await this.client.getFeedProviders(feedId, maxProviders);

    // 2. Get stake amounts for each provider
    const stakes = await Promise.all(
      addresses.map((address) => this.client.getProviderStake(address, feedId))
    );

    // 3. Get total staked for the feed
    const totalStaked = await this.client.getTotalStaked(feedId);

    // 3b. Get current price for the feed
    const currentPrice = await this.client.getCurrentPrice(feedId);

    // 4. Get feed configuration
    const feedInfo = await this.client.getFeedInfo(feedId);

    // 5. Get proposed prices for each provider
    const proposedPrices = await Promise.all(
      addresses.map((address) => this.client.getProviderProposedPrice(address, feedId))
    );

    // Combine provider data
    const submitters: Provider[] = addresses.map((address, i) => ({
      address,
      stakedCredits: stakes[i] ?? 0,
      proposedPrice: proposedPrices[i],
    }));

    // 6. Price history (currently mocked)
    // In a real implementation, this would come from a historical data source
    const priceHistory: PricePoint[] = [
      { timestamp: '10:00', price: 1.03 },
      { timestamp: '10:05', price: 1.04 },
      { timestamp: '10:10', price: 1.035 },
    ];

    // 7. Slashed addresses (currently mocked)
    // In a real implementation, this would come from event logs or a dedicated mapping
    const slashedAddresses: SlashedAddress[] = [
      { address: 'aleo9...', date: '2024-06-01' },
      { address: 'aleo10...', date: '2024-05-28' },
    ];

    // 8. Get advanced staking and aggregation info
    const [
      providerCount,
      proposalMedian,
      proposalProposer,
      proposalBlock,
      proposalSlashed,
      aggregateDone,
      slasher,
      slasherReward,
      lastProposeBlock,
    ] = await Promise.all([
      this.client.getProviderCount(feedId),
      this.client.getProposalMedian(feedId),
      this.client.getProposalProposer(feedId),
      this.client.getProposalBlock(feedId),
      this.client.getProposalSlashed(feedId),
      this.client.getAggregateDone(feedId),
      this.client.getSlasher(feedId),
      this.client.getSlasherReward(feedId),
      this.client.getLastProposeBlock(feedId),
    ]);

    // Return the complete feed object
    return {
      id: feedId,
      name: `Feed ${feedId}`,
      infos: feedInfo,
      totalStaked,
      submitters,
      priceHistory,
      slashedAddresses,
      currentPrice,
      providerCount: providerCount !== null ? providerCount : undefined,
      proposalMedian,
      proposalProposer,
      proposalBlock,
      proposalSlashed,
      aggregateDone,
      slasher,
      slasherReward,
      lastProposeBlock,
    };
  }
} 