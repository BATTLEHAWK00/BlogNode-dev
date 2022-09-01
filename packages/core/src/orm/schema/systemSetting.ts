import { SystemSetting } from '@src/interface/entities/systemSetting';
import mongoose from 'mongoose';

export default new mongoose.Schema<SystemSetting>({
  _id: {
    type: String, required: true,
  },
  value: { type: mongoose.Schema.Types.Mixed, default: {} },
  preload: { type: Boolean, default: false },
});
