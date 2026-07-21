import { Telegraf, session } from 'telegraf';
import { config } from './config';
import { connectDB } from './database';
import { logger } from './utils/logger';
import { authMiddleware } from './middlewares/authMiddleware';
import { startCommand } from './commands/startCommand';
import { adminCommands } from './commands/adminCommand';
import { handleMenuText } from './handlers/menuHandler';
import { callbackHandler } from './handlers/callbackHandler';
import { messageHandler } from './handlers/messageHandler';
import { startPremiumCron } from './cron/premiumCron';
import { BotContext } from './types';

const startBot = async () => {
  if (!config.BOT_TOKEN) {
    logger.error('BOT_TOKEN is not defined. Exiting...');
    process.exit(1);
  }

  await connectDB();
  startPremiumCron();

  const bot = new Telegraf<BotContext>(config.BOT_TOKEN);

  // Global Error Handling
  bot.catch((err, ctx) => {
    logger.error(err, `Error for ${ctx.updateType}`);
    if (config.SUPER_ADMIN_ID) {
      ctx.telegram.sendMessage(config.SUPER_ADMIN_ID, `⚠️ Xatolik:\n${String(err)}`).catch(() => {});
    }
  });

  // Middlewares
  bot.use(session());
  bot.use(authMiddleware);

  // Commands
  bot.start(startCommand);
  bot.command('ball', adminCommands);
  bot.command('stats', adminCommands);

  // Callbacks
  bot.on('callback_query', callbackHandler);

  // Message Handler (Menus & Anonymous Messages)
  bot.on('message', async (ctx, next) => {
    // If it's a menu text command
    if ('text' in ctx.message) {
       const isMenu = await handleMenuText(ctx);
       if (isMenu) return; // Handled by menu
       
       // Check if admin command
       if (ctx.message.text.startsWith('/')) {
         await adminCommands(ctx);
         return;
       }
    }
    
    // Otherwise it might be an anonymous message
    await messageHandler(ctx as any);
  });

  // Start polling
  bot.launch();
  logger.info('🤖 Anonymous Bot started successfully!');

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};

startBot();
