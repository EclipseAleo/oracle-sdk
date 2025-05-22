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
export function parseUint(raw: string | null, type: 'u128' | 'u64' | 'u32'): number {
  if (!raw) return 0;
  const match = raw.match(new RegExp(`([0-9]+)${type}`));
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Parses a boolean from an API response
 * 
 * @param raw The raw string response from the API
 * @returns The parsed boolean value or null if parsing fails
 */
export function parseBool(raw: string | null): boolean | null {
  return raw ? /true/.test(raw) : null;
}

/**
 * Parses a field (number) from an API response
 * 
 * @param raw The raw string response from the API
 * @returns The parsed field value or null if parsing fails
 */
export function parseField(raw: string | null): number | null {
  return raw ? parseInt(raw.match(/([0-9]+)/)?.[1] ?? '0', 10) : null;
}

/**
 * Parses an Aleo address from an API response
 * 
 * @param raw The raw string response from the API
 * @returns The parsed address or null if parsing fails
 */
export function parseAddress(raw: string | null): string | null {
  return raw?.match(/([a-z0-9]{59,})/)?.[1] ?? null;
} 