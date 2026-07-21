"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const helpers_1 = require("../utils/helpers");
const constants_1 = require("../constants");
const logger_1 = require("../utils/logger");
class UserService {
    async findOrCreateUser(telegramId, fullName, username) {
        let user = await UserRepository_1.userRepository.findByTelegramId(telegramId);
        let isNew = false;
        if (!user) {
            user = await UserRepository_1.userRepository.createUser({
                telegramId,
                fullName,
                username,
                referralCode: (0, helpers_1.generateReferralCode)(),
            });
            isNew = true;
        }
        else {
            // Update basic info if changed
            if (user.username !== username || user.fullName !== fullName) {
                user = await UserRepository_1.userRepository.updateUser(telegramId, { username, fullName });
            }
        }
        // Update last active
        user = await UserRepository_1.userRepository.updateUser(telegramId, { lastActive: new Date() });
        return { user, isNew };
    }
    async processReferral(newUserTelegramId, referralCode) {
        const inviter = await UserRepository_1.userRepository.findByReferralCode(referralCode);
        if (!inviter)
            return false;
        if (inviter.telegramId === newUserTelegramId) {
            logger_1.logger.warn(`Self referral attempt by ${newUserTelegramId}`);
            return false; // Prevent self referral
        }
        const newUser = await UserRepository_1.userRepository.findByTelegramId(newUserTelegramId);
        if (newUser && newUser.invitedBy) {
            return false; // Already referred
        }
        // Mark user as invited
        await UserRepository_1.userRepository.updateUser(newUserTelegramId, { invitedBy: inviter.telegramId });
        return true;
    }
    async verifyAndRewardReferral(newUserTelegramId) {
        const user = await UserRepository_1.userRepository.findByTelegramId(newUserTelegramId);
        if (!user || !user.invitedBy)
            return null;
        const inviter = await UserRepository_1.userRepository.findByTelegramId(user.invitedBy);
        if (!inviter)
            return null;
        // Grant reward to inviter
        await UserRepository_1.userRepository.addBall(inviter.telegramId, constants_1.CONSTANTS.REFERRAL_REWARD, 'Referral Reward');
        await UserRepository_1.userRepository.updateUser(inviter.telegramId, { referralCount: inviter.referralCount + 1 });
        return inviter.telegramId;
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=UserService.js.map