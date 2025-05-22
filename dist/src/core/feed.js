"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedService = void 0;
const client_1 = require("../api/client");
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
class FeedService {
    /**
     * Creates a new instance of the FeedService
     *
     * @param client AleoExplorerClient instance or config
     */
    constructor(client) {
        if (client instanceof client_1.AleoExplorerClient) {
            this.client = client;
        }
        else {
            this.client = new client_1.AleoExplorerClient(client);
        }
    }
    /**
     * Gets complete data for a feed
     *
     * @param feedId ID of the feed
     * @param maxProviders Maximum number of providers to check
     * @returns Complete feed data
     */
    getFeedFullData(feedId, maxProviders = MAX_PROVIDERS) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Get provider addresses
            const addresses = yield this.client.getFeedProviders(feedId, maxProviders);
            // 2. Get stake amounts for each provider
            const stakes = yield Promise.all(addresses.map((address) => this.client.getProviderStake(address, feedId)));
            // 3. Get total staked for the feed
            const totalStaked = yield this.client.getTotalStaked(feedId);
            // 3b. Get current price for the feed
            const currentPrice = yield this.client.getCurrentPrice(feedId);
            // 4. Get feed configuration
            const feedInfo = yield this.client.getFeedInfo(feedId);
            // 5. Get proposed prices for each provider
            const proposedPrices = yield Promise.all(addresses.map((address) => this.client.getProviderProposedPrice(address, feedId)));
            // Combine provider data
            const submitters = addresses.map((address, i) => {
                var _a;
                return ({
                    address,
                    stakedCredits: (_a = stakes[i]) !== null && _a !== void 0 ? _a : 0,
                    proposedPrice: proposedPrices[i],
                });
            });
            // 6. Price history (currently mocked)
            // In a real implementation, this would come from a historical data source
            const priceHistory = [
                { timestamp: '10:00', price: 1.03 },
                { timestamp: '10:05', price: 1.04 },
                { timestamp: '10:10', price: 1.035 },
            ];
            // 7. Slashed addresses (currently mocked)
            // In a real implementation, this would come from event logs or a dedicated mapping
            const slashedAddresses = [
                { address: 'aleo9...', date: '2024-06-01' },
                { address: 'aleo10...', date: '2024-05-28' },
            ];
            // 8. Get advanced staking and aggregation info
            const [providerCount, proposalMedian, proposalProposer, proposalBlock, proposalSlashed, aggregateDone, slasher, slasherReward, lastProposeBlock,] = yield Promise.all([
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
        });
    }
}
exports.FeedService = FeedService;
//# sourceMappingURL=feed.js.map