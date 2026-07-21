"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCommand = void 0;
const types_1 = require("../types");
const UserService_1 = require("../services/UserService");
const UserRepository_1 = require("../repositories/UserRepository");
const keyboards_1 = require("../menus/keyboards");
const helpers_1 = require("../utils/helpers");
const config_1 = require("../config");
const startCommand = async (ctx) => {
    const payload = ctx.message && 'text' in ctx.message ? ctx.message.text.split(' ')[1] : null;
    const user = ctx.user;
    if (!user)
        return ctx.reply('Failed to load user profile.');
    // If payload exists and it is a referral or user link
    if (payload) {
        if (payload.startsWith('ref_')) {
            // Process Referral
            const success = await UserService_1.userService.processReferral(user.telegramId, payload);
            if (success) {
                return ctx.reply('Welcome! To support the bot and verify your referral, please join our sponsor channels.', (0, keyboards_1.buildVerificationMenu)());
            }
        }
        else {
            // Anonymous Message Link
            const receiver = await UserRepository_1.userRepository.findByReferralCode(payload);
            if (receiver) {
                if (receiver.telegramId === user.telegramId) {
                    return ctx.reply('You cannot send an anonymous message to yourself!');
                }
                // Notify receiver about visitor
                if (receiver.settings.notifications) {
                    ctx.telegram.sendMessage(receiver.telegramId, `👀 Someone visited your anonymous page.\nDate: ${new Date().toLocaleString()}`).catch(() => { });
                    await UserRepository_1.userRepository.incrementVisitors(receiver.telegramId);
                }
                ctx.session = { anonymousReceiverId: receiver.telegramId }; // Simplified state for next message
                return ctx.reply(`You are now writing an anonymous message to ${(0, helpers_1.escapeMarkdownV2)(receiver.fullName)}.\n\nSend any text, photo, video, or voice message!`, { parse_mode: 'MarkdownV2' });
            }
        }
    }
    const link = (0, helpers_1.generateAnonymousLink)(config_1.config.BOT_USERNAME, user.referralCode);
    return ctx.reply(`Welcome to the Anonymous Messaging Bot!\n\nYour personal link is:\n${link}\n\nShare this link to receive anonymous messages!`, (0, keyboards_1.buildMainMenu)());
};
exports.startCommand = startCommand;
//# sourceMappingURL=startCommand.js.map