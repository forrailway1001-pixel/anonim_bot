"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAnonymousLink = exports.escapeMarkdownV2 = exports.generateReferralCode = void 0;
const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'ref_';
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
exports.generateReferralCode = generateReferralCode;
const escapeMarkdownV2 = (text) => {
    return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
};
exports.escapeMarkdownV2 = escapeMarkdownV2;
const generateAnonymousLink = (botUsername, referralCode) => {
    return `https://t.me/${botUsername}?start=${referralCode}`;
};
exports.generateAnonymousLink = generateAnonymousLink;
//# sourceMappingURL=helpers.js.map