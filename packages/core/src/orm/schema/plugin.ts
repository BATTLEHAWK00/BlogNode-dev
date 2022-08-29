import { Plugin } from '@src/interface/entities/plugin';
import { Schema } from 'mongoose';

export default new Schema<Plugin>({
  _id: { type: String },
  enable: { type: Boolean, required: true },
});
