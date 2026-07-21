import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings {
  sponsorChannels: string[];
}

export type SettingsDocument = ISettings & Document;

const SettingsSchema = new Schema({
  sponsorChannels: { type: [String], default: [] },
});

export const SettingsModel = mongoose.model<SettingsDocument>('Settings', SettingsSchema);

export const getSettings = async (): Promise<SettingsDocument> => {
  let settings = await SettingsModel.findOne();
  if (!settings) {
    settings = await SettingsModel.create({ sponsorChannels: [] });
  }
  return settings;
};
