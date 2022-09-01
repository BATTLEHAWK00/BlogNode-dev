import { Plugin } from '@src/interface/entities/plugin';
import mongoose from 'mongoose';

export default new mongoose.Schema<Plugin>({
  _id: { type: String },
  enable: { type: Boolean, required: true },
});
