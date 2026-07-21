"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MENUS = exports.CONSTANTS = void 0;
exports.CONSTANTS = {
    PREMIUM_PLANS: {
        DAYS_3: { days: 3, price: 150 },
        DAYS_7: { days: 7, price: 300 },
        DAYS_30: { days: 30, price: 1000 },
    },
    DAILY_BONUS_AMOUNT: 10,
    REFERRAL_REWARD: 50,
    DAILY_BONUS_COOLDOWN_MS: 24 * 60 * 60 * 1000,
};
exports.MENUS = {
    MAIN_MENU: [
        ['🏠 Home', '🔗 My Link'],
        ['💡 My Ball', '💎 Premium'],
        ['👥 Referral', '🏆 Leaderboard'],
        ['🎁 Daily Bonus', '📊 Statistics'],
        ['⚙️ Settings', '💬 Support']
    ],
    PREMIUM_MENU: [
        ['Buy 3 Days (150 Ball)'],
        ['Buy 7 Days (300 Ball)'],
        ['Buy 30 Days (1000 Ball)'],
        ['🔙 Back']
    ],
    REFERRAL_MENU: [
        ['🔗 Share Link'],
        ['🔙 Back']
    ],
    ADMIN_MENU: [
        ['📊 Stats', '👥 Users'],
        ['📢 Broadcast', '🔙 Back']
    ]
};
//# sourceMappingURL=index.js.map