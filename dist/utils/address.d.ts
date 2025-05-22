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
export declare function convertAddressToField(address: string): bigint;
//# sourceMappingURL=address.d.ts.map