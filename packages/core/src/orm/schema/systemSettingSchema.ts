import { SystemSetting } from '@src/interface/entities/systemSetting';
import { Schema } from 'mongoose';

export default new Schema<SystemSetting>({
  _id: {
    type: String, required: true,
  },
  value: { type: Schema.Types.Mixed, default: {} },
  preload: { type: Boolean, default: false },
});
