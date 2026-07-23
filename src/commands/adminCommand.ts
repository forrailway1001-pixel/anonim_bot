import { BotContext } from '../types';
import { config } from '../config';
import { userRepository } from '../repositories/UserRepository';
import { getSettings } from '../models/Settings';

export const adminCommands = async (ctx: BotContext) => {
  const user = ctx.user;
  if (!user || user.telegramId !== config.SUPER_ADMIN_ID) return;

  if (!ctx.message || !('text' in ctx.message)) return;
  const text = ctx.message.text;

  if (text.startsWith('/ball ')) {
    const parts = text.split(' ');
    if (parts.length !== 3) return ctx.reply('Foydalanish: /ball USER_ID MIQDOR');
    
    const targetId = parseInt(parts[1]);
    const amount = parseInt(parts[2]);

    if (isNaN(targetId) || isNaN(amount)) return ctx.reply('Noto\'g\'ri ID yoki Miqdor');

    await userRepository.addBall(targetId, amount, 'Admin Tomonidan');
    ctx.telegram.sendMessage(targetId, `🎁 Siz Admindan 💡 ${amount} Ball oldingiz!`).catch(() => {});
    return ctx.reply(`${targetId} foydalanuvchiga muvaffaqiyatli ${amount} ball qo'shildi.`);
  }

  if (text === '/stats') {
    const totalUsers = await userRepository.getTopUsersByReferrals(100000); // Hack to get all for now, optimize later
    return ctx.reply(`*Bot Statistikasi*\n\nJami Foydalanuvchilar: ${totalUsers.length}`);
  }

  if (text.startsWith('/add_channel ')) {
    const channel = text.split(' ')[1];
    if (!channel) return ctx.reply('Foydalanish: /add_channel @username');

    const settings = await getSettings();
    if (!settings.sponsorChannels.includes(channel)) {
      settings.sponsorChannels.push(channel);
      await settings.save();
      return ctx.reply(`✅ ${channel} kanali homiylar ro'yxatiga qo'shildi.`);
    }
    return ctx.reply('⚠️ Kanal allaqachon ro\'yxatda mavjud.');
  }

  if (text.startsWith('/delete_channel ')) {
    const channel = text.split(' ')[1];
    if (!channel) return ctx.reply('Foydalanish: /delete_channel @username');

    const settings = await getSettings();
    const index = settings.sponsorChannels.indexOf(channel);
    if (index !== -1) {
      settings.sponsorChannels.splice(index, 1);
      await settings.save();
      return ctx.reply(`✅ ${channel} kanali homiylar ro'yxatidan o'chirildi.`);
    }
    return ctx.reply('⚠️ Kanal ro\'yxatdan topilmadi.');
  }

  if (text === '/channels') {
    const settings = await getSettings();
    return ctx.reply(`*Homiy Kanallar:*\n\n${settings.sponsorChannels.join('\n') || 'Kanallar yo\'q.'}`, { parse_mode: 'Markdown' });
  }

  if (text.startsWith('/broadcast ')) {
    const message = text.substring('/broadcast '.length);
    if (!message.trim()) return ctx.reply('Foydalanish: /broadcast <xabar matni>');
    
    ctx.reply('Xabar yuborish boshlandi... Bu biroz vaqt olishi mumkin.');
    const users = await userRepository.getAllUsers();
    let successCount = 0;
    let failCount = 0;

    for (const u of users) {
      try {
        await ctx.telegram.sendMessage(u.telegramId, message);
        successCount++;
        // Kichik pauza, telegram limitlariga tushmaslik uchun
        await new Promise(r => setTimeout(r, 50));
      } catch (err) {
        failCount++;
      }
    }

    return ctx.reply(`Broadcast yakunlandi!\n\nMuvaffaqiyatli: ${successCount}\nXatolik/Bloklaganlar: ${failCount}`);
  }
};
