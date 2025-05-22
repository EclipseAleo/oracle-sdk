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
/**
 * Basic usage example for the Eclipse Oracle SDK
 */
const src_1 = require("../src");
/**
 * Demonstrate how to fetch complete feed data
 */
function fetchFeedData() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Fetching complete feed data...');
        // Create a feed service
        const feedService = new src_1.FeedService();
        // Get complete data for the Aleo/USD feed (ID: 3)
        const feedData = yield feedService.getFeedFullData('3');
        console.log('Feed name:', feedData.name);
        console.log('Current price:', feedData.currentPrice);
        console.log('Total staked:', feedData.totalStaked);
        console.log('Number of providers:', feedData.submitters.length);
        // Print details about each provider
        feedData.submitters.forEach((provider, index) => {
            var _a;
            console.log(`\nProvider ${index + 1}:`);
            console.log(`- Address: ${provider.address}`);
            console.log(`- Staked credits: ${provider.stakedCredits}`);
            console.log(`- Proposed price: ${(_a = provider.proposedPrice) !== null && _a !== void 0 ? _a : 'No proposal'}`);
        });
    });
}
/**
 * Demonstrate how to use the API client directly
 */
function useApiClient() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\nUsing API client directly...');
        // Create a client
        const client = new src_1.AleoExplorerClient();
        // Get the current price
        const price = yield client.getCurrentPrice('3');
        console.log('Current Aleo/USD price:', price);
        // Get feed configuration
        const feedInfo = yield client.getFeedInfo('3');
        console.log('Feed configuration:', feedInfo);
    });
}
/**
 * Demonstrate address conversion
 */
function demonstrateAddressConversion() {
    console.log('\nDemonstrating address conversion...');
    // Example Aleo address (this is just an example, not a real address)
    const aleoAddress = 'aleo1ht2a9q0gsd38j0se4t9lsfulxgqrens2vgzgry3pkvs93xrjqs8s6wrw3p';
    try {
        // Convert address to field
        const field = (0, src_1.convertAddressToField)(aleoAddress);
        console.log(`Address: ${aleoAddress}`);
        console.log(`Field: ${field.toString()}`);
    }
    catch (error) {
        console.error('Error converting address:', error);
    }
}
/**
 * Run all examples
 */
function runExamples() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fetchFeedData();
            yield useApiClient();
            demonstrateAddressConversion();
        }
        catch (error) {
            console.error('Error running examples:', error);
        }
    });
}
// Run the examples
runExamples();
//# sourceMappingURL=basic-usage.js.map