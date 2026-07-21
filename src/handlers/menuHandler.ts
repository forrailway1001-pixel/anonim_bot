import { BotContext } from '../types';
import { generateAnonymousLink } from '../utils/helpers';
import { buildPremiumMenu, buildReferralShareMenu } from '../menus/keyboards';
import { config } from '../config';
import { CONSTANTS } from '../constants';
import { userRepository } from '../repositories/UserRepository';

export const handleMenuText = async (ctx: BotContext) => {
  if (!ctx.message || !('text' in ctx.message)) return;
  const text = ctx.message.text;
  const user = ctx.user;
  if (!user) return;

  const formatDate = (date?: Date) => {
    if (!date) return '';
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${d}/${m}/${date.getFullYear()}`;
  };

  switch (text) {
    case '🏠 Asosiy':
      return ctx.reply('Asosiy menyuga xush kelibsiz!');
      
    case '⚙️ Settings':
    case '💬 Support':
      return ctx.reply('Bu imkoniyat tez orada qo\'shiladi!');

    case '🔗 Mening Referalim':
      const link = generateAnonymousLink(config.BOT_USERNAME, user.referralCode);
      return ctx.reply(`Mana sizning shaxsiy anonim linkingiz:\n\n${link}\n\nBuni Instagram, Telegram yoki WhatsApp'da ulashing!`);
      
    case '💡 Mening Ballarim':
      return ctx.reply(`Sizda hozir 💡 *${user.ball} Ball* mavjud.`, { parse_mode: 'Markdown' });
      
    case '💎 Premium':
      const status = user.premium ? `✅ Faol (Tugash vaqti: ${formatDate(user.premiumExpiration)})` : '❌ Faol emas';
      return ctx.reply(`*Premium Holati:* ${status}\n\nPremium Afzalliklari:\n- Anonim xabar yuboruvchining kimligini ko'rish\n- Maxsus belgilar\n\nTarifni tanlang:`, {
        parse_mode: 'Markdown',
        reply_markup: buildPremiumMenu().reply_markup
      });
      
    case '👥 Referal':
      return ctx.reply(`*Referal Statistikasi*\n\nTaklif qilinganlar: ${user.referralCount}\nIshlangan ballar: ${user.referralCount * CONSTANTS.REFERRAL_REWARD}\n\nKo'proq ball ishlash uchun do'stlaringizni taklif qiling!`, {
        parse_mode: 'Markdown',
        reply_markup: buildReferralShareMenu(config.BOT_USERNAME, user.referralCode).reply_markup
      });
      
    case '🏆 Reyting':
      const topUsers = await userRepository.getTopUsersByReferrals(10);
      let board = '*🏆 Top 10 Referallar*\n\n';
      topUsers.forEach((u, i) => {
         board += `${i + 1}. ${u.fullName} - ${u.referralCount} ta\n`;
      });
      return ctx.reply(board, { parse_mode: 'Markdown' });
      
    case '🎁 Kunlik Bonus':
      const now = new Date();
      if (user.dailyBonusTime && now.getTime() - user.dailyBonusTime.getTime() < CONSTANTS.DAILY_BONUS_COOLDOWN_MS) {
        const remaining = Math.ceil((CONSTANTS.DAILY_BONUS_COOLDOWN_MS - (now.getTime() - user.dailyBonusTime.getTime())) / (1000 * 60 * 60));
        return ctx.reply(`Siz bugungi bonusni olib bo'lgansiz. ${remaining} soatdan so'ng qayta urinib ko'ring!`);
      }
      
      await userRepository.addBall(user.telegramId, CONSTANTS.DAILY_BONUS_AMOUNT, 'Kunlik Bonus');
      await userRepository.updateUser(user.telegramId, { dailyBonusTime: now });
      return ctx.reply(`🎉 Siz kunlik bonus sifatida 💡 ${CONSTANTS.DAILY_BONUS_AMOUNT} Ball oldingiz!`);
      
    case '📊 Statistika':
      return ctx.reply(`*Sizning Statistikangiz*\n\nQabul qilingan xabarlar: ${user.statistics.messagesReceived}\nProfilga tashriflar: ${user.statistics.visitors}\nRo'yxatdan o'tgan sana: ${formatDate(user.registrationDate)}`, { parse_mode: 'Markdown' });
  }
};
