import mongoose, { Document } from 'mongoose';
import { IUser } from '../types';
export type UserDocument = IUser & Document;
export declare const UserModel: mongoose.Model<UserDocument, {}, {}, {}, Document<unknown, {}, UserDocument, {}, mongoose.DefaultSchemaOptions> & IUser & Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, UserDocument>;
//# sourceMappingURL=User.d.ts.map