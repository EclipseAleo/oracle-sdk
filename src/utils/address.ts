import { bech32m } from '@scure/base';

/**
 * Converts an Aleo bech32m address to an Aleo field.
 *
 * An Aleo address is encoded in bech32m. Decoding gives the
 * underlying bytes (representing the public key or hash).
 * These bytes are interpreted as a big integer to form the field.
 *
 * The interpretation seems to be Little-Endian for conversion to field.
 *
 * @param address The Aleo address in bech32m format (e.g., "aleo1...")
 * @returns The Aleo field representation (as bigint)
 * @throws Error if the address is invalid or if decoding fails.
 */
export function convertAddressToField(address: string): bigint {
  if (!address.startsWith('aleo1')) {
    throw new Error('Invalid address');
  }
  
  let decoded;
  try {
    decoded = bech32m.decode(address as `aleo1${string}`);
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Failed to decode bech32m address: ${e.message}`);
    }
    throw new Error(`Failed to decode bech32m address`);
  }

  // Check prefix (Human-Readable Part - HRP)
  if (decoded.prefix !== 'aleo') {
    throw new Error(
      `Invalid Aleo address prefix: Expected 'aleo', got '${decoded.prefix}'`,
    );
  }

  const bytes = bech32m.fromWords(decoded.words);
  const reversedBytes = [...bytes].reverse();

  // Build hex string from REVERSED bytes
  let hexString = '';
  for (const byte of reversedBytes) {
    hexString += byte.toString(16).padStart(2, '0');
  }

  const fieldBigInt = BigInt('0x' + hexString);
  return fieldBigInt;
} 