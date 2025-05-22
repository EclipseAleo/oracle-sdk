# Eclipse Oracle SDK for Aleo

A TypeScript SDK for interacting with Eclipse Oracle contracts on Aleo blockchain.

## Installation

```bash
npm install @eclipse/oracle-sdk
```

## Usage

### Getting Full Feed Data

```typescript
import { FeedService } from "@eclipse/oracle-sdk";

// Create a feed service
const feedService = new FeedService();

// Get complete data for a feed
const feedData = await feedService.getFeedFullData("3");
console.log(feedData);
```

### Using the API Client Directly

```typescript
import { AleoExplorerClient } from "@eclipse/oracle-sdk";

// Create a client with custom configuration
const client = new AleoExplorerClient({
  baseUrl: "https://api.explorer.provable.com/v1",
  network: "testnet",
});

// Get feed providers
const providers = await client.getFeedProviders("3");
console.log(providers);

// Get the current price
const price = await client.getCurrentPrice("3");
console.log(`Current Aleo/USD price: ${price}`);

// Get feed configuration information
const feedInfo = await client.getFeedInfo("3");
console.log(feedInfo);
```

### Utilities

```typescript
import { convertAddressToField } from "@eclipse/oracle-sdk";

// Convert an Aleo address to a field element
const field = convertAddressToField("aleo1...");
console.log(field.toString());
```

## API Reference

### FeedService

The main service for retrieving complete feed data.

- `getFeedFullData(feedId: string, maxProviders?: number): Promise<Feed>`

### AleoExplorerClient

Low-level client for interacting with Aleo contracts via the Explorer API.

- `getFeedProviders(feedId: string, maxProviders?: number): Promise<string[]>`
- `getProviderStake(address: string, feedId: string): Promise<number>`
- `getProviderProposedPrice(address: string, feedId: string): Promise<number | null>`
- `getTotalStaked(feedId: string): Promise<number>`
- `getCurrentPrice(feedId: string): Promise<number | null>`
- `getFeedInfo(feedId: string): Promise<FeedInfo | null>`
- `getProviderCount(feedId: string): Promise<number | null>`
- `getProposalMedian(feedId: string): Promise<number | null>`
- `getProposalProposer(feedId: string): Promise<string | null>`
- `getProposalBlock(feedId: string): Promise<number | null>`
- `getProposalSlashed(feedId: string): Promise<boolean | null>`
- `getAggregateDone(feedId: string): Promise<boolean | null>`
- `getSlasher(feedId: string): Promise<string | null>`
- `getSlasherReward(feedId: string): Promise<number | null>`
- `getLastProposeBlock(feedId: string): Promise<number | null>`

## License

ISC
