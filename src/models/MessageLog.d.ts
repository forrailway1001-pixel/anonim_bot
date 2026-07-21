import mongoose, { Document } from 'mongoose';
export interface IMessageLog {
    senderId?: number;
    receiverId: number;
    messageType: string;
    date: Date;
}
export type MessageLogDocument = IMessageLog & Document;
export declare const MessageLogModel: mongoose.Model<MessageLogDocument, {}, {}, {}, Document<unknown, {}, MessageLogDocument, {}, mongoose.DefaultSchemaOptions> & IMessageLog & Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, MessageLogDocument>;
//# sourceMappingURL=MessageLog.d.ts.map