import { AleoExplorerClient } from "../api/client";
import {
  Feed,
  FeedInfo,
  PricePoint,
  Provider,
  SlashedAddress,
} from "../types/feed";

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
  constructor(
    client?:
      | AleoExplorerClient
      | { baseUrl?: string; network?: "testnet" | "mainnet" }
  ) {
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
  async getFeedFullData(
    feedId: string,
    maxProviders = MAX_PROVIDERS
  ): Promise<Feed> {
    // 1. Get provider addresses
    const addresses = await this.client.getFeedProviders(feedId, maxProviders);

    // 2. Paralléliser tous les appels indépendants
    const [
      stakes,
      proposedPrices,
      totalStaked,
      currentPrice,
      feedInfo,
      advancedInfo,
    ] = await Promise.all([
      Promise.all(
        addresses.map((address) =>
          this.client.getProviderStake(address, feedId)
        )
      ),
      Promise.all(
        addresses.map((address) =>
          this.client.getProviderProposedPrice(address, feedId)
        )
      ),
      this.client.getTotalStaked(feedId),
      this.client.getCurrentPrice(feedId),
      this.client.getFeedInfo(feedId),
      Promise.all([
        this.client.getProviderCount(feedId),
        this.client.getProposalMedian(feedId),
        this.client.getProposalProposer(feedId),
        this.client.getProposalBlock(feedId),
        this.client.getProposalSlashed(feedId),
        this.client.getAggregateDone(feedId),
        this.client.getSlasher(feedId),
        this.client.getSlasherReward(feedId),
        this.client.getLastProposeBlock(feedId),
      ]),
    ]);

    // Combine provider data
    const submitters: Provider[] = addresses.map((address, i) => ({
      address,
      stakedCredits: stakes[i] ?? 0,
      proposedPrice: proposedPrices[i],
    }));

    // 6. Price history (mocked)
    const priceHistory: PricePoint[] = [
      { timestamp: "10:00", price: 1.03 },
      { timestamp: "10:05", price: 1.04 },
      { timestamp: "10:10", price: 1.035 },
    ];

    // 7. Slashed addresses (mocked)
    const slashedAddresses: SlashedAddress[] = [
      { address: "aleo9...", date: "2024-06-01" },
      { address: "aleo10...", date: "2024-05-28" },
    ];

    // 8. Advanced staking and aggregation info
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
    ] = advancedInfo;

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
