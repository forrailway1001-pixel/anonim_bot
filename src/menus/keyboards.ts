import { Markup } from 'telegraf';
import { MENUS } from '../constants';

export const buildMainMenu = () => {
  return Markup.keyboard(MENUS.MAIN_MENU).resize();
};

export const buildAdminMenu = () => {
  return Markup.keyboard(MENUS.ADMIN_MENU).resize();
};

export const buildPremiumMenu = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback('3 Kunlik (500 Ball)', 'buy_premium_3')],
    [Markup.button.callback('7 Kunlik (900 Ball)', 'buy_premium_7')],
    [Markup.button.callback('30 Kunlik (3000 Ball)', 'buy_premium_30')],
  ]);
};

export const buildReferralShareMenu = (botUsername: string, referralCode: string) => {
  const url = `https://t.me/${botUsername}?start=${referralCode}`;
  return Markup.inlineKeyboard([
    [Markup.button.url('↗️ Ulashish', `https://t.me/share/url?url=${url}&text=Menga anonim xabar yuboring!`)],
  ]);
};

export const buildAnonymousReplyMenu = (senderId: number) => {
  return Markup.inlineKeyboard([
    [Markup.button.callback('↩️ Anonim javob berish', `reply_${senderId}`)],
  ]);
};

export const buildSendAnotherMessageMenu = (receiverId: number) => {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🔄 Yana xabar yuborish', `reply_${receiverId}`)],
  ]);
};

export const buildVerificationMenu = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback('✅ Tasdiqlash', 'verify_channels')],
  ]);
};
