import mongoose, { Schema, Document } from 'mongoose';
import { IBallHistory } from '../types';

export type BallHistoryDocument = IBallHistory & Document;

const BallHistorySchema = new Schema({
  userId: { type: Number, required: true, index: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export const BallHistoryModel = mongoose.model<BallHistoryDocument>('BallHistory', BallHistorySchema);
