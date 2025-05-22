"use strict";
/**
 * Eclipse Oracle SDK for Aleo
 *
 * A TypeScript SDK for interacting with Eclipse Oracle contracts on Aleo
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAddress = exports.parseField = exports.parseBool = exports.parseUint = exports.convertAddressToField = exports.FeedService = exports.AleoExplorerClient = void 0;
// Re-export types
__exportStar(require("./types/feed"), exports);
// Re-export API client
var client_1 = require("./api/client");
Object.defineProperty(exports, "AleoExplorerClient", { enumerable: true, get: function () { return client_1.AleoExplorerClient; } });
// Re-export core services
var feed_1 = require("./core/feed");
Object.defineProperty(exports, "FeedService", { enumerable: true, get: function () { return feed_1.FeedService; } });
// Re-export utilities
var address_1 = require("./utils/address");
Object.defineProperty(exports, "convertAddressToField", { enumerable: true, get: function () { return address_1.convertAddressToField; } });
var parsing_1 = require("./utils/parsing");
Object.defineProperty(exports, "parseUint", { enumerable: true, get: function () { return parsing_1.parseUint; } });
Object.defineProperty(exports, "parseBool", { enumerable: true, get: function () { return parsing_1.parseBool; } });
Object.defineProperty(exports, "parseField", { enumerable: true, get: function () { return parsing_1.parseField; } });
Object.defineProperty(exports, "parseAddress", { enumerable: true, get: function () { return parsing_1.parseAddress; } });
//# sourceMappingURL=index.js.map