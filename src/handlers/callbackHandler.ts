import { BotContext } from '../types';
import { CONSTANTS } from '../constants';
import { userRepository } from '../repositories/UserRepository';
import { userService } from '../services/UserService';
import { getSettings } from '../models/Settings';

export const callbackHandler = async (ctx: BotContext & { session?: any }) => {
  if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) return;
  const data = ctx.callbackQuery.data;
  const user = ctx.user;
  if (!user) return;

  // Answer callback query to remove loading state
  ctx.answerCbQuery().catch(() => {});

  if (data.startsWith('buy_premium_')) {
    const days = parseInt(data.split('_')[2]);
    let plan;
    if (days === 3) plan = CONSTANTS.PREMIUM_PLANS.DAYS_3;
    if (days === 7) plan = CONSTANTS.PREMIUM_PLANS.DAYS_7;
    if (days === 30) plan = CONSTANTS.PREMIUM_PLANS.DAYS_30;

    if (!plan) return ctx.reply('Noto\'g\'ri tarif.');

    if (user.ball < plan.price) {
      return ctx.reply(`❌ Ballingiz yetarli emas. Sizga ${plan.price} ball kerak, lekin sizda ${user.ball} ball bor.`);
    }

    // Purchase Premium
    let expiration = new Date();
    if (user.premium && user.premiumExpiration && user.premiumExpiration > expiration) {
      expiration = new Date(user.premiumExpiration);
    }
    expiration.setDate(expiration.getDate() + plan.days);
    
    await userRepository.addBall(user.telegramId, -plan.price, `Premium sotib olindi (${days} kun)`);
    await userRepository.updateUser(user.telegramId, { premium: true, premiumExpiration: expiration });
    
    return ctx.reply(`✅ Muvaffaqiyatli! Siz ${days} kunga Premium sotib oldingiz.`);
  }

  if (data === 'verify_channels') {
    const settings = await getSettings();
    let success = true;
    let notJoined: string[] = [];

    // Real Telegraf check for each channel
    for (const channel of settings.sponsorChannels) {
      try {
        const member = await ctx.telegram.getChatMember(channel, user.telegramId);
        if (member.status === 'left' || member.status === 'kicked') {
          success = false;
          notJoined.push(channel);
        }
      } catch (e) {
        // If bot is not admin in channel, or channel invalid, we assume false
        success = false;
        notJoined.push(channel);
      }
    }

    if (success) {
      const inviterId = await userService.verifyAndRewardReferral(user.telegramId);
      if (inviterId) {
        ctx.telegram.sendMessage(inviterId, '🎉 Siz taklif qilgan foydalanuvchi tasdiqdan o\'tdi! Siz 💡 50 Ball oldingiz.');
      }
      return ctx.editMessageText('✅ Tasdiqlandi! Endi botdan to\'liq foydalanishingiz mumkin.');
    } else {
      return ctx.reply(`❌ Siz barcha homiy kanallarga a'zo bo'lmadingiz.\n\nIltimos, quyidagilarga a'zo bo'ling: ${notJoined.join(', ')}`);
    }
  }

  if (data.startsWith('reply_')) {
    const senderId = parseInt(data.split('_')[1]);
    if (ctx.session) {
      ctx.session.anonymousReceiverId = senderId;
      return ctx.reply('Siz hozir anonim javob yozyapsiz. Xabaringizni yuboring:');
    }
  }
};
