import { UserModel, UserDocument } from '../models/User';
import { BallHistoryModel } from '../models/BallHistory';

export class UserRepository {
  async findByTelegramId(telegramId: number): Promise<UserDocument | null> {
    return UserModel.findOne({ telegramId });
  }

  async findByReferralCode(referralCode: string): Promise<UserDocument | null> {
    return UserModel.findOne({ referralCode });
  }

  async createUser(userData: Partial<UserDocument>): Promise<UserDocument> {
    return UserModel.create(userData);
  }

  async updateUser(telegramId: number, updateData: Partial<UserDocument>): Promise<UserDocument | null> {
    return UserModel.findOneAndUpdate({ telegramId }, updateData, { new: true });
  }

  async addBall(telegramId: number, amount: number, reason: string): Promise<void> {
    await UserModel.updateOne({ telegramId }, { $inc: { ball: amount } });
    await BallHistoryModel.create({ userId: telegramId, amount, reason });
  }

  async getTopUsersByReferrals(limit: number = 10): Promise<UserDocument[]> {
    return UserModel.find().sort({ referralCount: -1 }).limit(limit);
  }

  async getTopUsersByBalls(limit: number = 10): Promise<UserDocument[]> {
    return UserModel.find().sort({ ball: -1 }).limit(limit);
  }

  async incrementMessagesReceived(telegramId: number): Promise<void> {
    await UserModel.updateOne(
      { telegramId },
      { $inc: { 'statistics.messagesReceived': 1 } }
    );
  }

  async incrementVisitors(telegramId: number): Promise<void> {
    await UserModel.updateOne(
      { telegramId },
      { $inc: { 'statistics.visitors': 1 } }
    );
  }
}

export const userRepository = new UserRepository();
