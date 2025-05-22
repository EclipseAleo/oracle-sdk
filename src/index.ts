/**
 * Eclipse Oracle SDK for Aleo
 * 
 * A TypeScript SDK for interacting with Eclipse Oracle contracts on Aleo
 */

// Re-export types
export * from './types/feed';

// Re-export API client
export { 
  AleoExplorerClient, 
  ApiClientConfig 
} from './api/client';

// Re-export core services
export { FeedService } from './core/feed';

// Re-export utilities
export { convertAddressToField } from './utils/address';
export { 
  parseUint, 
  parseBool, 
  parseField, 
  parseAddress 
} from './utils/parsing'; 