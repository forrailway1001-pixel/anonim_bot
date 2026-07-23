import { BotContext } from '../types';
import { userRepository } from '../repositories/UserRepository';
import { MessageLogModel } from '../models/MessageLog';
import { buildAnonymousReplyMenu, buildSendAnotherMessageMenu } from '../menus/keyboards';
import { escapeMarkdownV2 } from '../utils/helpers';
import { config } from '../config';

export const messageHandler = async (ctx: BotContext & { session?: any }) => {
  const user = ctx.user;
  if (!user) return;

  // Handle anonymous message sending
  if (ctx.session?.anonymousReceiverId) {
    const receiverId = ctx.session.anonymousReceiverId;
    
    try {
      const receiver = await userRepository.findByTelegramId(receiverId);
      if (!receiver) return ctx.reply('Foydalanuvchi topilmadi.');

      let senderInfo = '🕵️ *Anonim*';
      if (user.premium) {
        senderInfo = `💎 *Premium Foydalanuvchi*\nIsmi: ${escapeMarkdownV2(user.fullName)}\nUsername: ${user.username ? '@' + user.username : 'Yo\'q'}\nID: \`${user.telegramId}\``;
      }

      const caption = `${senderInfo}\n\n`;
      let sentMessage;

      // Determine message type and copy it to receiver
      if (ctx.message && 'text' in ctx.message) {
        sentMessage = await ctx.telegram.sendMessage(receiverId, `${caption}${escapeMarkdownV2(ctx.message.text)}`, {
          parse_mode: 'MarkdownV2',
          reply_markup: buildAnonymousReplyMenu(user.telegramId).reply_markup,
        });
      } else if (ctx.message) {
         // Copy other media types
         sentMessage = await ctx.copyMessage(receiverId, {
           reply_markup: buildAnonymousReplyMenu(user.telegramId).reply_markup
         });
         await ctx.telegram.sendMessage(receiverId, senderInfo, { parse_mode: 'MarkdownV2', reply_parameters: { message_id: sentMessage.message_id } });
      }

      // Log message
      await MessageLogModel.create({
        senderId: user.premium ? user.telegramId : undefined,
        receiverId,
        messageType: ctx.message && 'text' in ctx.message ? 'text' : 'media',
      });

      await userRepository.incrementMessagesReceived(receiverId);

      // Send to Log Channel
      try {
         await ctx.forwardMessage('-1003122548668');
         await ctx.telegram.sendMessage('-1003122548668', `👆 ${user.telegramId} dan ${receiverId} ga anonim xabar`);
      } catch (err) {}

      ctx.session.anonymousReceiverId = null; // Clear session
      return ctx.reply('✅ Xabaringiz muvaffaqiyatli yuborildi!', buildSendAnotherMessageMenu(receiverId));

    } catch (error) {
      return ctx.reply('❌ Xabar yuborishda xatolik yuz berdi. Balki bu foydalanuvchi botni bloklagandir.');
    }
  }

  // If user used swipe-to-reply without setting session
  if (ctx.message && 'reply_to_message' in ctx.message && ctx.message.reply_to_message) {
    return ctx.reply('⚠️ Iltimos, xabarga javob berish uchun xabar ostidagi "↩️ Anonim javob berish" tugmasini bosing.');
  }

  // Not writing an anonymous message, fallback to default behavior
  return ctx.reply('Iltimos, menyudan foydalaning yoki yaroqli anonim link yuboring.');
};
