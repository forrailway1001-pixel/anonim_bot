import { UserDocument } from '../models/User';
export declare class UserRepository {
    findByTelegramId(telegramId: number): Promise<UserDocument | null>;
    findByReferralCode(referralCode: string): Promise<UserDocument | null>;
    createUser(userData: Partial<UserDocument>): Promise<UserDocument>;
    updateUser(telegramId: number, updateData: Partial<UserDocument>): Promise<UserDocument | null>;
    addBall(telegramId: number, amount: number, reason: string): Promise<void>;
    getTopUsersByReferrals(limit?: number): Promise<UserDocument[]>;
    getTopUsersByBalls(limit?: number): Promise<UserDocument[]>;
    incrementMessagesReceived(telegramId: number): Promise<void>;
    incrementVisitors(telegramId: number): Promise<void>;
}
export declare const userRepository: UserRepository;
//# sourceMappingURL=UserRepository.d.ts.map