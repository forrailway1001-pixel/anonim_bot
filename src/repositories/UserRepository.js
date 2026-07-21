"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const User_1 = require("../models/User");
const BallHistory_1 = require("../models/BallHistory");
class UserRepository {
    async findByTelegramId(telegramId) {
        return User_1.UserModel.findOne({ telegramId });
    }
    async findByReferralCode(referralCode) {
        return User_1.UserModel.findOne({ referralCode });
    }
    async createUser(userData) {
        return User_1.UserModel.create(userData);
    }
    async updateUser(telegramId, updateData) {
        return User_1.UserModel.findOneAndUpdate({ telegramId }, updateData, { new: true });
    }
    async addBall(telegramId, amount, reason) {
        await User_1.UserModel.updateOne({ telegramId }, { $inc: { ball: amount } });
        await BallHistory_1.BallHistoryModel.create({ userId: telegramId, amount, reason });
    }
    async getTopUsersByReferrals(limit = 10) {
        return User_1.UserModel.find().sort({ referralCount: -1 }).limit(limit);
    }
    async getTopUsersByBalls(limit = 10) {
        return User_1.UserModel.find().sort({ ball: -1 }).limit(limit);
    }
    async incrementMessagesReceived(telegramId) {
        await User_1.UserModel.updateOne({ telegramId }, { $inc: { 'statistics.messagesReceived': 1 } });
    }
    async incrementVisitors(telegramId) {
        await User_1.UserModel.updateOne({ telegramId }, { $inc: { 'statistics.visitors': 1 } });
    }
}
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
//# sourceMappingURL=UserRepository.js.map