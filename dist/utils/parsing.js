"use strict";
/**
 * Utility functions for parsing contract responses
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAddress = exports.parseField = exports.parseBool = exports.parseUint = void 0;
/**
 * Parses a u128, u64 or u32 from an API response
 *
 * @param raw The raw string response from the API
 * @param type The type of integer to parse
 * @returns The parsed integer value or 0 if parsing fails
 */
function parseUint(raw, type) {
    if (!raw)
        return 0;
    const match = raw.match(new RegExp(`([0-9]+)${type}`));
    return match ? parseInt(match[1], 10) : 0;
}
exports.parseUint = parseUint;
/**
 * Parses a boolean from an API response
 *
 * @param raw The raw string response from the API
 * @returns The parsed boolean value or null if parsing fails
 */
function parseBool(raw) {
    return raw ? /true/.test(raw) : null;
}
exports.parseBool = parseBool;
/**
 * Parses a field (number) from an API response
 *
 * @param raw The raw string response from the API
 * @returns The parsed field value or null if parsing fails
 */
function parseField(raw) {
    var _a, _b;
    return raw ? parseInt((_b = (_a = raw.match(/([0-9]+)/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '0', 10) : null;
}
exports.parseField = parseField;
/**
 * Parses an Aleo address from an API response
 *
 * @param raw The raw string response from the API
 * @returns The parsed address or null if parsing fails
 */
function parseAddress(raw) {
    var _a, _b;
    return (_b = (_a = raw === null || raw === void 0 ? void 0 : raw.match(/([a-z0-9]{59,})/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : null;
}
exports.parseAddress = parseAddress;
//# sourceMappingURL=parsing.js.map