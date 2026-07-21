import { userRepository } from '../repositories/UserRepository';
import { generateReferralCode } from '../utils/helpers';
import { CONSTANTS } from '../constants';
import { logger } from '../utils/logger';

export class UserService {
  async findOrCreateUser(telegramId: number, fullName: string, username?: string): Promise<{ user: any, isNew: boolean }> {
    let user = await userRepository.findByTelegramId(telegramId);
    let isNew = false;
    if (!user) {
      user = await userRepository.createUser({
        telegramId,
        fullName,
        username: username || '',
        referralCode: generateReferralCode(),
      });
      isNew = true;
    } else {
      // Update basic info if changed
      if (user.username !== username || user.fullName !== fullName) {
        user = await userRepository.updateUser(telegramId, { username: username || '', fullName });
      }
    }
    
    // Update last active
    user = await userRepository.updateUser(telegramId, { lastActive: new Date() });
    
    return { user, isNew };
  }

  async processReferral(newUserTelegramId: number, referralCode: string): Promise<boolean> {
    const inviter = await userRepository.findByReferralCode(referralCode);
    if (!inviter) return false;
    
    if (inviter.telegramId === newUserTelegramId) {
      logger.warn(`Self referral attempt by ${newUserTelegramId}`);
      return false; // Prevent self referral
    }

    const newUser = await userRepository.findByTelegramId(newUserTelegramId);
    if (newUser && newUser.invitedBy) {
       return false; // Already referred
    }

    // Mark user as invited
    await userRepository.updateUser(newUserTelegramId, { invitedBy: inviter.telegramId });
    return true;
  }

  async verifyAndRewardReferral(newUserTelegramId: number): Promise<number | null> {
    const user = await userRepository.findByTelegramId(newUserTelegramId);
    if (!user || !user.invitedBy) return null;

    const inviter = await userRepository.findByTelegramId(user.invitedBy);
    if (!inviter) return null;

    // Grant reward to inviter
    await userRepository.addBall(inviter.telegramId, CONSTANTS.REFERRAL_REWARD, 'Referral Reward');
    await userRepository.updateUser(inviter.telegramId, { referralCount: inviter.referralCount + 1 });
    
    return inviter.telegramId;
  }
}

export const userService = new UserService();
