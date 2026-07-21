"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    BOT_TOKEN: process.env.BOT_TOKEN || '',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/anonimbot',
    SUPER_ADMIN_ID: parseInt(process.env.SUPER_ADMIN_ID || '0'),
    BOT_USERNAME: process.env.BOT_USERNAME || 'my_anonymous_bot',
    SPONSOR_CHANNELS: (process.env.SPONSOR_CHANNELS || '').split(',').filter(c => c.trim() !== ''),
};
if (!exports.config.BOT_TOKEN) {
    console.warn('WARNING: BOT_TOKEN is missing in environment variables!');
}
if (!exports.config.SUPER_ADMIN_ID) {
    console.warn('WARNING: SUPER_ADMIN_ID is missing in environment variables!');
}
//# sourceMappingURL=index.js.map