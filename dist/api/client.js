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
exports.AleoExplorerClient = void 0;
const address_1 = require("../utils/address");
const parsing_1 = require("../utils/parsing");
/**
 * Default configuration for the API client
 */
const DEFAULT_CONFIG = {
    baseUrl: 'https://api.explorer.provable.com/v1',
    network: 'testnet',
};
/**
 * Client for interacting with Aleo contracts via the Explorer API
 */
class AleoExplorerClient {
    /**
     * Creates a new instance of the AleoExplorerClient
     *
     * @param config Configuration options
     */
    constructor(config = {}) {
        this.baseUrl = config.baseUrl || DEFAULT_CONFIG.baseUrl;
        this.network = config.network || DEFAULT_CONFIG.network;
    }
    /**
     * Fetches data from the API
     *
     * @param endpoint API endpoint
     * @returns Response data as text
     */
    fetchData(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${this.baseUrl}/${this.network}/${endpoint}`);
                if (!response.ok)
                    return null;
                return yield response.text();
            }
            catch (error) {
                console.error('Error fetching data:', error);
                return null;
            }
        });
    }
    /**
     * Fetches a mapping value from a contract
     *
     * @param program Program name
     * @param mapping Mapping name
     * @param key Key to look up
     * @returns Mapping value as text
     */
    getMappingValue(program, mapping, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetchData(`program/${program}/mapping/${mapping}/${key}`);
        });
    }
    /**
     * Gets a feed provider list
     *
     * @param feedId ID of the feed
     * @param maxProviders Maximum number of providers to fetch
     * @returns Array of provider addresses
     */
    getFeedProviders(feedId, maxProviders = 8) {
        return __awaiter(this, void 0, void 0, function* () {
            const providerRequests = Array.from({ length: maxProviders }, (_, i) => this.getMappingValue('eclipse_oracle_staking_2.aleo', 'provider_list', `${Number(feedId) + i}field`).then(raw => (0, parsing_1.parseAddress)(raw)));
            const addresses = (yield Promise.all(providerRequests)).filter(Boolean);
            return addresses;
        });
    }
    /**
     * Gets the stake amount for a provider in a feed
     *
     * @param address Provider address
     * @param feedId Feed ID
     * @returns Stake amount (in credits)
     */
    getProviderStake(address, feedId) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = ((0, address_1.convertAddressToField)(address) + BigInt(feedId)).toString();
            const raw = yield this.getMappingValue('eclipse_oracle_staking_2.aleo', 'stakes', `${key}field`);
            return (0, parsing_1.parseUint)(raw, 'u128');
        });
    }
    /**
     * Gets the proposed price for a provider in a feed
     *
     * @param address Provider address
     * @param feedId Feed ID
     * @returns Proposed price or null if no proposal
     */
    getProviderProposedPrice(address, feedId) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = ((0, address_1.convertAddressToField)(address) + BigInt(feedId)).toString();
            const raw = yield this.getMappingValue('eclipse_oracle_submit_2.aleo', 'temp_price', `${key}field`);
            return raw ? (0, parsing_1.parseUint)(raw, 'u128') / 1e6 : null;
        });
    }
    /**
     * Gets the total staked amount for a feed
     *
     * @param feedId Feed ID
     * @returns Total staked amount
     */
    getTotalStaked(feedId) {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield this.getMappingValue('eclipse_oracle_staking_2.aleo', 'total_staked', `${feedId}field`);
            return (0, parsing_1.parseUint)(raw, 'u128');
        });
    }
    /**
     * Gets the current price for a feed
     *
     * @param feedId Feed ID
     * @returns Current price or null if not available
     */
    getCurrentPrice(feedId) {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield this.getMappingValue('eclipse_oracle_aggregate_2.aleo', 'latest_price', `${feedId}field`);
            return raw ? (0, parsing_1.parseUint)(raw, 'u128') / 1e6 : null;
        });
    }
    /**
     * Gets configuration information for a feed
     *
     * @param feedId Feed ID
     * @returns Feed configuration information
     */
    getFeedInfo(feedId) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield this.getMappingValue('eclipse_oracle_feed.aleo', 'feeds', `${feedId}field`);
            if (!raw)
                return null;
            const creator = (_b = (_a = raw.match(/creator:\s*([a-z0-9]+)/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '';
            const min_stake = (0, parsing_1.parseUint)(raw, 'u64');
            const slashing_threshold = (0, parsing_1.parseUint)(raw === null || raw === void 0 ? void 0 : raw.split('slashing_threshold:')[1], 'u64');
            const aggregation_window = (0, parsing_1.parseUint)(raw, 'u32');
            const challenge_window = (0, parsing_1.parseUint)(raw === null || raw === void 0 ? void 0 : raw.split('challenge_window:')[1], 'u32');
            const paused = ((_d = (_c = raw.match(/paused:\s*(true|false)/)) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : 'false') === 'true';
            return {
                creator,
                min_stake,
                slashing_threshold,
                aggregation_window,
                challenge_window,
                paused,
            };
        });
    }
    /**
     * Gets the count of providers for a feed
     *
     * @param feedId Feed ID
     * @returns Provider count
     */
    getProviderCount(feedId) {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield this.getMappingValue('eclipse_oracle_staking_2.aleo', 'provider_count', `${feedId}field`);
            return (0, parsing_1.parseField)(raw);
        });
    }
    /**
     * Gets the proposal median for a feed
     *
     * @param feedId Feed ID
     * @returns Proposal median or null if not available
     */
    getProposalMedian(feedId) {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield this.getMappingValue('eclipse_oracle_aggregate_2.aleo', 'proposal_median', `${feedId}field`);
            return raw ? (0, parsing_1.parseField)(raw) ? (0, parsing_1.parseField)(raw) / 1e6 : null : null;
        });
    }
    /**
     * Gets the proposal proposer for a feed
     *
     * @param feedId Feed ID
     * @returns Proposer address or null if not available
     */
    getProposalProposer(feedId) {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield this.getMappingValue('eclipse_oracle_aggregate_2.aleo', 'proposal_proposer', `${feedId}field`);
            return (0, parsing_1.parseAddress)(raw);
        });
    }
    /**
     * Gets the proposal block for a feed
     *
     * @param feedId Feed ID
     * @returns Proposal block number or null if not available
     */
    getProposalBlock(feedId) {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield this.getMappingValue('eclipse_oracle_aggregate_2.aleo', 'proposal_block', `${feedId}field`);
            return (0, parsing_1.parseField)(raw);
        });
    }
    /**
     * Checks if the proposal was slashed for a feed
     *
     * @param feedId Feed ID
     * @returns True if slashed, false if not, null if not available
     */
    getProposalSlashed(feedId) {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield this.getMappingValue('eclipse_oracle_aggregate_2.aleo', 'proposal_slashed', `${feedId}field`);
            return (0, parsing_1.parseBool)(raw);
        });
    }
    /**
     * Checks if the aggregate is done for a feed
     *
     * @param feedId Feed ID
     * @returns True if done, false if not, null if not available
     */
    getAggregateDone(feedId) {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield this.getMappingValue('eclipse_oracle_aggregate_2.aleo', 'aggregate_done', `${feedId}field`);
            return (0, parsing_1.parseBool)(raw);
        });
    }
    /**
     * Gets the slasher for a feed
     *
     * @param feedId Feed ID
     * @returns Slasher address or null if not available
     */
    getSlasher(feedId) {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield this.getMappingValue('eclipse_oracle_aggregate_2.aleo', 'slasher', `${feedId}field`);
            return (0, parsing_1.parseAddress)(raw);
        });
    }
    /**
     * Gets the slasher reward for a feed
     *
     * @param feedId Feed ID
     * @returns Slasher reward or null if not available
     */
    getSlasherReward(feedId) {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield this.getMappingValue('eclipse_oracle_aggregate_2.aleo', 'slasher_reward', `${feedId}field`);
            return (0, parsing_1.parseField)(raw);
        });
    }
    /**
     * Gets the last propose block for a feed
     *
     * @param feedId Feed ID
     * @returns Last propose block number or null if not available
     */
    getLastProposeBlock(feedId) {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield this.getMappingValue('eclipse_oracle_aggregate_2.aleo', 'last_propose_block', `${feedId}field`);
            return (0, parsing_1.parseField)(raw);
        });
    }
}
exports.AleoExplorerClient = AleoExplorerClient;
//# sourceMappingURL=client.js.map