"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const config_1 = require("./config");
const database_1 = require("./database");
const logger_1 = require("./utils/logger");
const authMiddleware_1 = require("./middlewares/authMiddleware");
const startCommand_1 = require("./commands/startCommand");
const adminCommand_1 = require("./commands/adminCommand");
const menuHandler_1 = require("./handlers/menuHandler");
const callbackHandler_1 = require("./handlers/callbackHandler");
const messageHandler_1 = require("./handlers/messageHandler");
const premiumCron_1 = require("./cron/premiumCron");
const types_1 = require("./types");
const startBot = async () => {
    if (!config_1.config.BOT_TOKEN) {
        logger_1.logger.error('BOT_TOKEN is not defined. Exiting...');
        process.exit(1);
    }
    await (0, database_1.connectDB)();
    (0, premiumCron_1.startPremiumCron)();
    const bot = new telegraf_1.Telegraf(config_1.config.BOT_TOKEN);
    // Global Error Handling
    bot.catch((err, ctx) => {
        logger_1.logger.error(`Error for ${ctx.updateType}`, err);
        if (config_1.config.SUPER_ADMIN_ID) {
            ctx.telegram.sendMessage(config_1.config.SUPER_ADMIN_ID, `⚠️ Error:\n${String(err)}`).catch(() => { });
        }
    });
    // Middlewares
    bot.use((0, telegraf_1.session)());
    bot.use(authMiddleware_1.authMiddleware);
    // Commands
    bot.start(startCommand_1.startCommand);
    bot.command('ball', adminCommand_1.adminCommands);
    bot.command('stats', adminCommand_1.adminCommands);
    // Callbacks
    bot.on('callback_query', callbackHandler_1.callbackHandler);
    // Message Handler (Menus & Anonymous Messages)
    bot.on('message', async (ctx, next) => {
        // If it's a menu text command
        if ('text' in ctx.message) {
            const isMenu = await (0, menuHandler_1.handleMenuText)(ctx);
            if (isMenu)
                return; // Handled by menu
            // Check if admin command
            if (ctx.message.text.startsWith('/')) {
                await (0, adminCommand_1.adminCommands)(ctx);
                return;
            }
        }
        // Otherwise it might be an anonymous message
        await (0, messageHandler_1.messageHandler)(ctx);
    });
    // Start polling
    bot.launch();
    logger_1.logger.info('🤖 Anonymous Bot started successfully!');
    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
};
startBot();
//# sourceMappingURL=main.js.map