export const CONSTANTS = {
  PREMIUM_PLANS: {
    DAYS_3: { days: 3, price: 500 },
    DAYS_7: { days: 7, price: 900 },
    DAYS_30: { days: 30, price: 3000 },
  },
  DAILY_BONUS_AMOUNT: 10,
  REFERRAL_REWARD: 50,
  DAILY_BONUS_COOLDOWN_MS: 24 * 60 * 60 * 1000,
};

export const MENUS = {
  MAIN_MENU: [
    ['🏠 Asosiy', '🔗 Mening Referalim'],
    ['💡 Mening Ballarim', '💎 Premium'],
    ['👥 Referal', '🏆 Reyting'],
    ['🎁 Kunlik Bonus', '📊 Statistika']
  ],
  PREMIUM_MENU: [
    ['3 Kunlik (500 Ball)'],
    ['7 Kunlik (900 Ball)'],
    ['30 Kunlik (3000 Ball)'],
    ['🔙 Orqaga']
  ],
  REFERRAL_MENU: [
    ['🔗 Ulashish'],
    ['🔙 Orqaga']
  ],
  ADMIN_MENU: [
    ['📊 Statistika', '👥 Foydalanuvchilar'],
    ['📢 Xabar Yuborish', '🔙 Orqaga']
  ]
};
