import { Markup } from 'telegraf';
export declare const buildMainMenu: () => Markup.Markup<import("@telegraf/types").ReplyKeyboardMarkup>;
export declare const buildAdminMenu: () => Markup.Markup<import("@telegraf/types").ReplyKeyboardMarkup>;
export declare const buildPremiumMenu: () => Markup.Markup<import("@telegraf/types").InlineKeyboardMarkup>;
export declare const buildReferralShareMenu: (botUsername: string, referralCode: string) => Markup.Markup<import("@telegraf/types").InlineKeyboardMarkup>;
export declare const buildAnonymousReplyMenu: (senderId: number) => Markup.Markup<import("@telegraf/types").InlineKeyboardMarkup>;
export declare const buildVerificationMenu: () => Markup.Markup<import("@telegraf/types").InlineKeyboardMarkup>;
//# sourceMappingURL=keyboards.d.ts.map