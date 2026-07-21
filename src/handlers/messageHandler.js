"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageHandler = void 0;
const types_1 = require("../types");
const UserRepository_1 = require("../repositories/UserRepository");
const MessageLog_1 = require("../models/MessageLog");
const keyboards_1 = require("../menus/keyboards");
const helpers_1 = require("../utils/helpers");
const config_1 = require("../config");
const messageHandler = async (ctx) => {
    const user = ctx.user;
    if (!user)
        return;
    // Handle anonymous message sending
    if (ctx.session?.anonymousReceiverId) {
        const receiverId = ctx.session.anonymousReceiverId;
        try {
            const receiver = await UserRepository_1.userRepository.findByTelegramId(receiverId);
            if (!receiver)
                return ctx.reply('Receiver not found.');
            let senderInfo = '🕵️ *Anonymous*';
            if (user.premium) {
                senderInfo = `💎 *Premium User*\nName: ${(0, helpers_1.escapeMarkdownV2)(user.fullName)}\nUsername: ${user.username ? '@' + user.username : 'None'}\nID: \`${user.telegramId}\``;
            }
            const caption = `${senderInfo}\n\n`;
            let sentMessage;
            // Determine message type and copy it to receiver
            if (ctx.message && 'text' in ctx.message) {
                sentMessage = await ctx.telegram.sendMessage(receiverId, `${caption}${(0, helpers_1.escapeMarkdownV2)(ctx.message.text)}`, {
                    parse_mode: 'MarkdownV2',
                    reply_markup: (0, keyboards_1.buildAnonymousReplyMenu)(user.telegramId).reply_markup,
                });
            }
            else if (ctx.message) {
                // Copy other media types
                sentMessage = await ctx.copyMessage(receiverId, {
                    reply_markup: (0, keyboards_1.buildAnonymousReplyMenu)(user.telegramId).reply_markup
                });
                await ctx.telegram.sendMessage(receiverId, senderInfo, { parse_mode: 'MarkdownV2', reply_to_message_id: sentMessage.message_id });
            }
            // Log message
            await MessageLog_1.MessageLogModel.create({
                senderId: user.premium ? user.telegramId : null,
                receiverId,
                messageType: ctx.message && 'text' in ctx.message ? 'text' : 'media',
            });
            await UserRepository_1.userRepository.incrementMessagesReceived(receiverId);
            // Send to Super Admin
            if (config_1.config.SUPER_ADMIN_ID) {
                await ctx.forwardMessage(config_1.config.SUPER_ADMIN_ID);
                await ctx.telegram.sendMessage(config_1.config.SUPER_ADMIN_ID, `👆 Anonymous message from ${user.telegramId} to ${receiverId}`);
            }
            ctx.session.anonymousReceiverId = null; // Clear session
            return ctx.reply('✅ Your message has been sent successfully!');
        }
        catch (error) {
            return ctx.reply('❌ Failed to send message. The user might have blocked the bot.');
        }
    }
    // Not writing an anonymous message, fallback to default behavior
    return ctx.reply('Please use the buttons or send a valid link.');
};
exports.messageHandler = messageHandler;
//# sourceMappingURL=messageHandler.js.map