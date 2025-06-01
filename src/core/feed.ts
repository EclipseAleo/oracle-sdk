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
 * Feed service for retrieving complete feed data
 */
export class FeedService {
  private client: AleoExplorerClient;
  private aggregateProgramId: string;


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
    this.aggregateProgramId = "eclipse_oracle_aggregate_4.aleo";
  }

  /**
   * Get the price history of a feed
   * @param feedId Feed ID
   * @param maxTransactions Maximum number of transactions to analyze (max 1000 per request)
   * @returns Array of PricePoint (timestamp (UNIX timestamp), price)
   */
  async getPriceHistory(feedId: string): Promise<PricePoint[]> {
    const functionName = "propose";
    const url = "https://testnetbeta.aleorpc.com";
    const pageSize = 1000; // Max per request according to the doc
    let page = 0;
    let totalFetched = 0;
    let finished = false;
    const history: PricePoint[] = [];

    while (!finished && totalFetched < pageSize) {
      const toFetch = Math.min(pageSize, pageSize - totalFetched);
      const body = JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "aleoTransactionsForProgram",
        params: {
          programId: this.aggregateProgramId,
          functionName,
          page,
          maxTransactions: toFetch,
        },
      });

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) break;
      const data = await res.json();
      const txs = data.result || [];
      if (txs.length === 0) break;

      for (const tx of txs) {
        const finalizedAt = tx.finalizedAt || tx.transaction?.finalizedAt || "";
        const transitions = tx.transaction?.execution?.transitions || [];
        for (const transition of transitions) {
          if (
            transition.program === this.aggregateProgramId &&
            transition.function === functionName
          ) {
            const inputFeed = (transition.inputs || []).find(
              (input: any) => input.value === `${feedId}field`
            );
            if (inputFeed) {
              const priceInput = (transition.inputs || []).find(
                (input: any) =>
                  typeof input.value === "string" &&
                  input.value.match(/^[0-9]+u128$/)
              );
              if (priceInput) {
                const price =
                  Number(priceInput.value.replace("u128", "")) / 1e6;
                history.push({ timestamp: finalizedAt, price });
              }
            }
          }
        }
      }

      totalFetched += txs.length;
      page += 1;
      if (txs.length < toFetch) finished = true;
    }

    // Sort by increasing date
    return history.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
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

    // 2. Parallelize all independent calls
    const [
      stakes,
      proposedPrices,
      totalStaked,
      currentPrice,
      feedInfo,
      advancedInfo,
      priceHistory,
      slashedAddresses,
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
      this.getPriceHistory(feedId),
      this.getSlashedAddresses(feedId),
    ]);

    // 3. Combine provider data
    const submitters: Provider[] = addresses.map((address, i) => ({
      address,
      stakedCredits: stakes[i] ?? 0,
      proposedPrice: proposedPrices[i],
    }));

    // 4. Advanced staking and aggregation info
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

    // 5. Return the complete feed object
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

  /**
   * Get the slashed addresses history for a feed
   * @param feedId Feed ID
   * @param maxTransactions Maximum number of transactions to analyze (max 1000 per request)
   * @returns Array of { address, date, type }
   */
  async getSlashedAddresses(
    feedId: string
  ): Promise<
    { address: string; date: string; type: "aggregator" | "provider" }[]
  > {
    const url = "https://testnetbeta.aleorpc.com";
    const pageSize = 1000;
    let page = 0;
    let totalFetched = 0;
    let finished = false;
    const slashed: {
      address: string;
      date: string;
      type: "aggregator" | "provider";
    }[] = [];
    const functions = ["slash_aggregator", "slash_provider"];

    while (!finished && totalFetched < pageSize) {
      const toFetch = Math.min(pageSize, pageSize - totalFetched);
      const body = JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "aleoTransactionsForProgram",
        params: {
          programId: this.aggregateProgramId,
          page,
          maxTransactions: toFetch,
        },
      });

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) break;
      const data = await res.json();
      const txs = data.result || [];
      if (txs.length === 0) break;

      for (const tx of txs) {
        const finalizedAt = tx.finalizedAt || tx.transaction?.finalizedAt || "";
        const transitions = tx.transaction?.execution?.transitions || [];
        for (const transition of transitions) {
          if (
            transition.program === this.aggregateProgramId &&
            functions.includes(transition.function)
          ) {
            const inputFeed = (transition.inputs || []).find(
              (input: any) => input.value === `${feedId}field`
            );
            if (inputFeed) {
              // slash_aggregator: proposer, slash_provider: provider
              let slashedInput;
              let type: "aggregator" | "provider" | undefined = undefined;
              if (transition.function === "slash_aggregator") {
                slashedInput = (transition.inputs || []).find(
                  (input: any) =>
                    typeof input.value === "string" &&
                    input.value.startsWith("aleo") &&
                    input.name === "proposer"
                );
                type = "aggregator";
              } else if (transition.function === "slash_provider") {
                slashedInput = (transition.inputs || []).find(
                  (input: any) =>
                    typeof input.value === "string" &&
                    input.value.startsWith("aleo") &&
                    input.name === "provider"
                );
                type = "provider";
              }
              if (slashedInput && type) {
                slashed.push({
                  address: slashedInput.value,
                  date: finalizedAt,
                  type,
                });
              }
            }
          }
        }
      }

      totalFetched += txs.length;
      page += 1;
      if (txs.length < toFetch) finished = true;
    }

    // Sort by increasing date
    return slashed.sort((a, b) => (a.date > b.date ? 1 : -1));
  }
}
