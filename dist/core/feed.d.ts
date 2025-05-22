import { AleoExplorerClient } from '../api/client';
import { Feed } from '../types/feed';
/**
 * Feed service for retrieving complete feed data
 */
export declare class FeedService {
    private client;
    /**
     * Creates a new instance of the FeedService
     *
     * @param client AleoExplorerClient instance or config
     */
    constructor(client?: AleoExplorerClient | {
        baseUrl?: string;
        network?: 'testnet' | 'mainnet';
    });
    /**
     * Gets complete data for a feed
     *
     * @param feedId ID of the feed
     * @param name Display name of the feed
     * @param maxProviders Maximum number of providers to check
     * @returns Complete feed data
     */
    getFeedFullData(feedId: string, name: string, maxProviders?: number): Promise<Feed>;
}
//# sourceMappingURL=feed.d.ts.map