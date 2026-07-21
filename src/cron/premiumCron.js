"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startPremiumCron = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const User_1 = require("../models/User");
const logger_1 = require("../utils/logger");
const startPremiumCron = () => {
    // Run every hour to check for expired premium subscriptions
    node_cron_1.default.schedule('0 * * * *', async () => {
        logger_1.logger.info('Running premium expiration cron job...');
        const now = new Date();
        try {
            const result = await User_1.UserModel.updateMany({ premium: true, premiumExpiration: { $lte: now } }, { $set: { premium: false, premiumExpiration: null } });
            if (result.modifiedCount > 0) {
                logger_1.logger.info(`Expired premium for ${result.modifiedCount} users.`);
            }
        }
        catch (error) {
            logger_1.logger.error('Premium cron job error:', error);
        }
    });
};
exports.startPremiumCron = startPremiumCron;
//# sourceMappingURL=premiumCron.js.map