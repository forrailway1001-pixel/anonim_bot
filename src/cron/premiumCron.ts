import cron from 'node-cron';
import { UserModel } from '../models/User';
import { logger } from '../utils/logger';

export const startPremiumCron = () => {
  // Run every hour to check for expired premium subscriptions
  cron.schedule('0 * * * *', async () => {
    logger.info('Running premium expiration cron job...');
    const now = new Date();
    
    try {
      const result = await UserModel.updateMany(
        { premium: true, premiumExpiration: { $lte: now } },
        { $set: { premium: false, premiumExpiration: null } }
      );
      
      if (result.modifiedCount > 0) {
        logger.info(`Expired premium for ${result.modifiedCount} users.`);
      }
    } catch (error) {
      logger.error(error, 'Premium cron job error:');
    }
  });
};
