import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../types';

export type UserDocument = IUser & Document;

const UserSchema = new Schema({
  telegramId: { type: Number, required: true, unique: true, index: true },
  username: { type: String, default: null },
  fullName: { type: String, required: true },
  language: { type: String, default: 'en' },
  referralCode: { type: String, required: true, unique: true, index: true },
  invitedBy: { type: Number, default: null },
  referralCount: { type: Number, default: 0 },
  ball: { type: Number, default: 0 },
  premium: { type: Boolean, default: false },
  premiumExpiration: { type: Date, default: null },
  dailyBonusTime: { type: Date, default: null },
  registrationDate: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  statistics: {
    messagesReceived: { type: Number, default: 0 },
    visitors: { type: Number, default: 0 },
  },
  settings: {
    notifications: { type: Boolean, default: true },
  },
  banStatus: { type: Boolean, default: false },
});

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
