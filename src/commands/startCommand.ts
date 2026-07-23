import { BotContext } from '../types';
import { userService } from '../services/UserService';
import { userRepository } from '../repositories/UserRepository';
import { buildMainMenu, buildVerificationMenu } from '../menus/keyboards';
import { escapeMarkdownV2, generateAnonymousLink } from '../utils/helpers';
import { config } from '../config';

export const startCommand = async (ctx: BotContext) => {
  const payload = ctx.message && 'text' in ctx.message ? ctx.message.text.split(' ')[1] : null;
  const user = ctx.user;

  if (!user) return ctx.reply('Foydalanuvchi profilini yuklashda xatolik yuz berdi.');

  // If payload exists
  if (payload && payload.startsWith('ref_')) {
    const receiver = await userRepository.findByReferralCode(payload);
    
    if (receiver) {
      if (receiver.telegramId === user.telegramId) {
        return ctx.reply('Siz o\'zingizga o\'zingiz anonim xabar yoza olmaysiz!');
      }

      ctx.session = { anonymousReceiverId: receiver.telegramId };

      // Process Referral
      const success = await userService.processReferral(user.telegramId, payload);
      if (success) {
        return ctx.reply(
          'Xush kelibsiz! Botimizni qo\'llab-quvvatlash uchun homiy kanallarimizga obuna bo\'ling.\n\nObuna bo\'lgach, anonim xabar yuborishingiz mumkin!',
          buildVerificationMenu()
        );
      }

      // Notify receiver about visitor
      if (receiver.settings.notifications) {
         ctx.telegram.sendMessage(
           receiver.telegramId,
           `👀 Kimdir sizning anonim sahifangizga kirdi.\nSana: ${new Date().toLocaleString()}`
         ).catch(() => {});
         await userRepository.incrementVisitors(receiver.telegramId);
      }

      return ctx.reply(`Siz hozir ${escapeMarkdownV2(receiver.fullName)} ga anonim xabar yozyapsiz.\n\nIstalgan matn, rasm, video yoki ovozli xabar yuborishingiz mumkin!`, { parse_mode: 'MarkdownV2' });
    }
  }

  const link = generateAnonymousLink(config.BOT_USERNAME, user.referralCode);
  return ctx.reply(
    `Anonim Xabarlar Botiga Xush Kelibsiz!\n\nSizning shaxsiy referalingiz (link):\n${link}\n\nAnonim xabarlar qabul qilish uchun ushbu linkni do'stlaringizga ulashing!`,
    buildMainMenu()
  );
};
