/**
 * Basic usage example for the Eclipse Oracle SDK
 */
import { FeedService, AleoExplorerClient, convertAddressToField } from '../src';

/**
 * Demonstrate how to fetch complete feed data
 */
async function fetchFeedData() {
  console.log('Fetching complete feed data...');
  
  // Create a feed service
  const feedService = new FeedService();
  
  // Get complete data for the Aleo/USD feed (ID: 3)
  const feedData = await feedService.getFeedFullData('3');
  
  console.log('Feed name:', feedData.name);
  console.log('Current price:', feedData.currentPrice);
  console.log('Total staked:', feedData.totalStaked);
  console.log('Number of providers:', feedData.submitters.length);
  
  // Print details about each provider
  feedData.submitters.forEach((provider, index) => {
    console.log(`\nProvider ${index + 1}:`);
    console.log(`- Address: ${provider.address}`);
    console.log(`- Staked credits: ${provider.stakedCredits}`);
    console.log(`- Proposed price: ${provider.proposedPrice ?? 'No proposal'}`);
  });
}

/**
 * Demonstrate how to use the API client directly
 */
async function useApiClient() {
  console.log('\nUsing API client directly...');
  
  // Create a client
  const client = new AleoExplorerClient();
  
  // Get the current price
  const price = await client.getCurrentPrice('3');
  console.log('Current Aleo/USD price:', price);
  
  // Get feed configuration
  const feedInfo = await client.getFeedInfo('3');
  console.log('Feed configuration:', feedInfo);
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
    const field = convertAddressToField(aleoAddress);
    console.log(`Address: ${aleoAddress}`);
    console.log(`Field: ${field.toString()}`);
  } catch (error) {
    console.error('Error converting address:', error);
  }
}

/**
 * Run all examples
 */
async function runExamples() {
  try {
    await fetchFeedData();
    await useApiClient();
    demonstrateAddressConversion();
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run the examples
runExamples(); 