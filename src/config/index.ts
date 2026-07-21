import dotenv from 'dotenv';
dotenv.config();

export const config = {
  BOT_TOKEN: process.env.BOT_TOKEN || '',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/anonimbot',
  SUPER_ADMIN_ID: parseInt(process.env.SUPER_ADMIN_ID || '0'),
  BOT_USERNAME: process.env.BOT_USERNAME || 'my_anonymous_bot',
  SPONSOR_CHANNELS: (process.env.SPONSOR_CHANNELS || '').split(',').filter(c => c.trim() !== ''),
};

if (!config.BOT_TOKEN) {
  console.warn('WARNING: BOT_TOKEN is missing in environment variables!');
}
if (!config.SUPER_ADMIN_ID) {
  console.warn('WARNING: SUPER_ADMIN_ID is missing in environment variables!');
}
