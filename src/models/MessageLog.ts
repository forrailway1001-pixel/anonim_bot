import mongoose, { Schema, Document } from 'mongoose';

export interface IMessageLog {
  senderId?: number; // null if anonymous
  receiverId: number;
  messageType: string;
  date: Date;
}

export type MessageLogDocument = IMessageLog & Document;

const MessageLogSchema = new Schema({
  senderId: { type: Number, default: null },
  receiverId: { type: Number, required: true, index: true },
  messageType: { type: String, required: true }, // text, photo, video, etc
  date: { type: Date, default: Date.now },
});

export const MessageLogModel = mongoose.model<MessageLogDocument>('MessageLog', MessageLogSchema);
