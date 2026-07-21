"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildVerificationMenu = exports.buildAnonymousReplyMenu = exports.buildReferralShareMenu = exports.buildPremiumMenu = exports.buildAdminMenu = exports.buildMainMenu = void 0;
const telegraf_1 = require("telegraf");
const constants_1 = require("../constants");
const buildMainMenu = () => {
    return telegraf_1.Markup.keyboard(constants_1.MENUS.MAIN_MENU).resize();
};
exports.buildMainMenu = buildMainMenu;
const buildAdminMenu = () => {
    return telegraf_1.Markup.keyboard(constants_1.MENUS.ADMIN_MENU).resize();
};
exports.buildAdminMenu = buildAdminMenu;
const buildPremiumMenu = () => {
    return telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback('Buy 3 Days (150 Ball)', 'buy_premium_3')],
        [telegraf_1.Markup.button.callback('Buy 7 Days (300 Ball)', 'buy_premium_7')],
        [telegraf_1.Markup.button.callback('Buy 30 Days (1000 Ball)', 'buy_premium_30')],
    ]);
};
exports.buildPremiumMenu = buildPremiumMenu;
const buildReferralShareMenu = (botUsername, referralCode) => {
    const url = `https://t.me/${botUsername}?start=${referralCode}`;
    return telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.url('↗️ Share Link', `https://t.me/share/url?url=${url}&text=Send me an anonymous message!`)],
    ]);
};
exports.buildReferralShareMenu = buildReferralShareMenu;
const buildAnonymousReplyMenu = (senderId) => {
    return telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback('↩️ Reply Anonymously', `reply_${senderId}`)],
    ]);
};
exports.buildAnonymousReplyMenu = buildAnonymousReplyMenu;
const buildVerificationMenu = () => {
    return telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback('✅ Verify', 'verify_channels')],
    ]);
};
exports.buildVerificationMenu = buildVerificationMenu;
//# sourceMappingURL=keyboards.js.map