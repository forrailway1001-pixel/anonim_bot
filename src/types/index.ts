import { Context } from 'telegraf';

export interface BotContext extends Context {
  user?: IUser;
  session?: any;
}

export interface IUser {
  telegramId: number;
  username?: string;
  fullName: string;
  language?: string;
  referralCode: string;
  invitedBy?: number;
  referralCount: number;
  ball: number;
  premium: boolean;
  premiumExpiration?: Date;
  dailyBonusTime?: Date;
  registrationDate: Date;
  lastActive: Date;
  statistics: {
    messagesReceived: number;
    visitors: number;
  };
  settings: {
    notifications: boolean;
  };
  banStatus: boolean;
}

export interface IBallHistory {
  userId: number;
  amount: number;
  reason: string;
  date: Date;
}

export interface IPremiumTransaction {
  userId: number;
  planDays: number;
  costBalls: number;
  date: Date;
}

export interface IStatistics {
  date: Date;
  newUsers: number;
  messagesSent: number;
  premiumPurchases: number;
}
