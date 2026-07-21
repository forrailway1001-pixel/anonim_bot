"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCommands = void 0;
const types_1 = require("../types");
const config_1 = require("../config");
const UserRepository_1 = require("../repositories/UserRepository");
const adminCommands = async (ctx) => {
    const user = ctx.user;
    if (!user || user.telegramId !== config_1.config.SUPER_ADMIN_ID)
        return;
    if (!ctx.message || !('text' in ctx.message))
        return;
    const text = ctx.message.text;
    if (text.startsWith('/ball ')) {
        const parts = text.split(' ');
        if (parts.length !== 3)
            return ctx.reply('Usage: /ball USER_ID AMOUNT');
        const targetId = parseInt(parts[1]);
        const amount = parseInt(parts[2]);
        if (isNaN(targetId) || isNaN(amount))
            return ctx.reply('Invalid ID or Amount');
        await UserRepository_1.userRepository.addBall(targetId, amount, 'Admin Reward');
        ctx.telegram.sendMessage(targetId, `🎁 You have received 💡 ${amount} Balls from Admin!`).catch(() => { });
        return ctx.reply(`Successfully added ${amount} balls to user ${targetId}.`);
    }
    if (text === '/stats') {
        const totalUsers = await UserRepository_1.userRepository.getTopUsersByReferrals(100000); // Hack to get all for now, optimize later
        return ctx.reply(`*Bot Statistics*\n\nTotal Users: ${totalUsers.length}`);
    }
};
exports.adminCommands = adminCommands;
//# sourceMappingURL=adminCommand.js.map