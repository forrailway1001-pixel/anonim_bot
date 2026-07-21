"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMenuText = void 0;
const types_1 = require("../types");
const helpers_1 = require("../utils/helpers");
const keyboards_1 = require("../menus/keyboards");
const config_1 = require("../config");
const constants_1 = require("../constants");
const UserRepository_1 = require("../repositories/UserRepository");
const handleMenuText = async (ctx) => {
    if (!ctx.message || !('text' in ctx.message))
        return;
    const text = ctx.message.text;
    const user = ctx.user;
    if (!user)
        return;
    switch (text) {
        case '🏠 Home':
            return ctx.reply('Welcome back to the Home menu!');
        case '🔗 My Link':
            const link = (0, helpers_1.generateAnonymousLink)(config_1.config.BOT_USERNAME, user.referralCode);
            return ctx.reply(`Here is your unique anonymous link:\n\n${link}\n\nShare this on Instagram, Telegram, or WhatsApp!`);
        case '💡 My Ball':
            return ctx.reply(`You currently have 💡 *${user.ball} Ball(s)*.`, { parse_mode: 'Markdown' });
        case '💎 Premium':
            const status = user.premium ? `✅ Active until ${user.premiumExpiration?.toLocaleDateString()}` : '❌ Inactive';
            return ctx.reply(`*Premium Status:* ${status}\n\nPremium Advantages:\n- Reveal anonymous sender details\n- Exclusive badges\n\nChoose a plan to upgrade:`, {
                parse_mode: 'Markdown',
                reply_markup: (0, keyboards_1.buildPremiumMenu)().reply_markup
            });
        case '👥 Referral':
            return ctx.reply(`*Referral Statistics*\n\nInvited Users: ${user.referralCount}\nEarned Balls: ${user.referralCount * constants_1.CONSTANTS.REFERRAL_REWARD}\n\nShare your link to earn more balls!`, {
                parse_mode: 'Markdown',
                reply_markup: (0, keyboards_1.buildReferralShareMenu)(config_1.config.BOT_USERNAME, user.referralCode).reply_markup
            });
        case '🏆 Leaderboard':
            const topUsers = await UserRepository_1.userRepository.getTopUsersByReferrals(10);
            let board = '*🏆 Top 10 Referrers*\n\n';
            topUsers.forEach((u, i) => {
                board += `${i + 1}. ${u.fullName} - ${u.referralCount} referrals\n`;
            });
            return ctx.reply(board, { parse_mode: 'Markdown' });
        case '🎁 Daily Bonus':
            const now = new Date();
            if (user.dailyBonusTime && now.getTime() - user.dailyBonusTime.getTime() < constants_1.CONSTANTS.DAILY_BONUS_COOLDOWN_MS) {
                const remaining = Math.ceil((constants_1.CONSTANTS.DAILY_BONUS_COOLDOWN_MS - (now.getTime() - user.dailyBonusTime.getTime())) / (1000 * 60 * 60));
                return ctx.reply(`You have already claimed your daily bonus. Come back in ${remaining} hours!`);
            }
            await UserRepository_1.userRepository.addBall(user.telegramId, constants_1.CONSTANTS.DAILY_BONUS_AMOUNT, 'Daily Bonus');
            await UserRepository_1.userRepository.updateUser(user.telegramId, { dailyBonusTime: now });
            return ctx.reply(`🎉 You received 💡 ${constants_1.CONSTANTS.DAILY_BONUS_AMOUNT} Balls as your daily bonus!`);
        case '📊 Statistics':
            return ctx.reply(`*Your Statistics*\n\nMessages Received: ${user.statistics.messagesReceived}\nProfile Visitors: ${user.statistics.visitors}\nRegistration Date: ${user.registrationDate.toLocaleDateString()}`, { parse_mode: 'Markdown' });
        case '⚙️ Settings':
        case '💬 Support':
            return ctx.reply('This feature is coming soon!');
    }
};
exports.handleMenuText = handleMenuText;
//# sourceMappingURL=menuHandler.js.map