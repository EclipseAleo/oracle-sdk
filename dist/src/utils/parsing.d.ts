/**
 * Utility functions for parsing contract responses
 */
/**
 * Parses a u128, u64 or u32 from an API response
 *
 * @param raw The raw string response from the API
 * @param type The type of integer to parse
 * @returns The parsed integer value or 0 if parsing fails
 */
export declare function parseUint(raw: string | null, type: 'u128' | 'u64' | 'u32'): number;
/**
 * Parses a boolean from an API response
 *
 * @param raw The raw string response from the API
 * @returns The parsed boolean value or null if parsing fails
 */
export declare function parseBool(raw: string | null): boolean | null;
/**
 * Parses a field (number) from an API response
 *
 * @param raw The raw string response from the API
 * @returns The parsed field value or null if parsing fails
 */
export declare function parseField(raw: string | null): number | null;
/**
 * Parses an Aleo address from an API response
 *
 * @param raw The raw string response from the API
 * @returns The parsed address or null if parsing fails
 */
export declare function parseAddress(raw: string | null): string | null;
//# sourceMappingURL=parsing.d.ts.map