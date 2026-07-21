"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callbackHandler = void 0;
const types_1 = require("../types");
const constants_1 = require("../constants");
const UserRepository_1 = require("../repositories/UserRepository");
const UserService_1 = require("../services/UserService");
const callbackHandler = async (ctx) => {
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery))
        return;
    const data = ctx.callbackQuery.data;
    const user = ctx.user;
    if (!user)
        return;
    // Answer callback query to remove loading state
    ctx.answerCbQuery().catch(() => { });
    if (data.startsWith('buy_premium_')) {
        const days = parseInt(data.split('_')[2]);
        let plan;
        if (days === 3)
            plan = constants_1.CONSTANTS.PREMIUM_PLANS.DAYS_3;
        if (days === 7)
            plan = constants_1.CONSTANTS.PREMIUM_PLANS.DAYS_7;
        if (days === 30)
            plan = constants_1.CONSTANTS.PREMIUM_PLANS.DAYS_30;
        if (!plan)
            return ctx.reply('Invalid plan.');
        if (user.ball < plan.price) {
            return ctx.reply(`❌ Not enough balls. You need ${plan.price} balls, but you only have ${user.ball}.`);
        }
        // Purchase Premium
        const expiration = new Date();
        expiration.setDate(expiration.getDate() + plan.days);
        await UserRepository_1.userRepository.addBall(user.telegramId, -plan.price, `Bought Premium ${days} Days`);
        await UserRepository_1.userRepository.updateUser(user.telegramId, { premium: true, premiumExpiration: expiration });
        return ctx.reply(`✅ Success! You have purchased Premium for ${days} days.`);
    }
    if (data === 'verify_channels') {
        // Placeholder logic: in reality, check Telegraf getChatMember
        const success = true; // Assume success for now
        if (success) {
            const inviterId = await UserService_1.userService.verifyAndRewardReferral(user.telegramId);
            if (inviterId) {
                ctx.telegram.sendMessage(inviterId, '🎉 One of your referrals has completed verification! You received 💡 50 Balls.');
            }
            return ctx.editMessageText('✅ Verification successful! You can now use the bot fully.');
        }
        else {
            return ctx.reply('❌ You have not joined all sponsor channels yet.');
        }
    }
    if (data.startsWith('reply_')) {
        const senderId = parseInt(data.split('_')[1]);
        if (ctx.session) {
            ctx.session.anonymousReceiverId = senderId;
            return ctx.reply('You are now replying anonymously. Send your message:');
        }
    }
};
exports.callbackHandler = callbackHandler;
//# sourceMappingURL=callbackHandler.js.map