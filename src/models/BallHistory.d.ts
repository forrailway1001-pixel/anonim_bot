import mongoose, { Document } from 'mongoose';
import { IBallHistory } from '../types';
export type BallHistoryDocument = IBallHistory & Document;
export declare const BallHistoryModel: mongoose.Model<BallHistoryDocument, {}, {}, {}, Document<unknown, {}, BallHistoryDocument, {}, mongoose.DefaultSchemaOptions> & IBallHistory & Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, BallHistoryDocument>;
//# sourceMappingURL=BallHistory.d.ts.map