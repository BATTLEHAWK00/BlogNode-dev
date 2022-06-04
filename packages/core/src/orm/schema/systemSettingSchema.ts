import { SystemSetting } from '@src/interface/entities/systemSetting';
import { Schema } from 'mongoose';

export default new Schema<SystemSetting>({
  _id: {
    type: String, required: true,
  },
  value: { default: {} },
});
