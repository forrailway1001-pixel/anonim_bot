import { Context } from 'telegraf';
import { BotContext } from '../types';
import { userService } from '../services/UserService';
import { logger } from '../utils/logger';

export const authMiddleware = async (ctx: BotContext, next: () => Promise<void>) => {
  if (!ctx.from) return next();

  try {
    const { id: telegramId, first_name, last_name, username } = ctx.from;
    const fullName = `${first_name} ${last_name || ''}`.trim();

    const { user, isNew } = await userService.findOrCreateUser(telegramId, fullName, username);
    
    if (user) {
      if (user.banStatus) {
        return ctx.reply('Siz ushbu botdan foydalanishdan bloklangansiz.');
      }
      ctx.user = user;
    }
  } catch (error) {
    logger.error(error, `Auth Middleware Error for ${ctx.from.id}:`);
  }

  return next();
};
