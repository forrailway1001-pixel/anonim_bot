"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const telegraf_1 = require("telegraf");
const types_1 = require("../types");
const UserService_1 = require("../services/UserService");
const logger_1 = require("../utils/logger");
const authMiddleware = async (ctx, next) => {
    if (!ctx.from)
        return next();
    try {
        const { id: telegramId, first_name, last_name, username } = ctx.from;
        const fullName = `${first_name} ${last_name || ''}`.trim();
        const { user, isNew } = await UserService_1.userService.findOrCreateUser(telegramId, fullName, username);
        if (user) {
            if (user.banStatus) {
                return ctx.reply('You are banned from using this bot.');
            }
            ctx.user = user;
        }
    }
    catch (error) {
        logger_1.logger.error(`Auth Middleware Error for ${ctx.from.id}:`, error);
    }
    return next();
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map