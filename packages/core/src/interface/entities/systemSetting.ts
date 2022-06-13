import { Entity } from './base';

type AllowedTypes = string | number | boolean | Date;

export type CompoundTypes = AllowedTypes | SettingObject | AllowedTypes[];

interface SettingObject{
  [key: string]: CompoundTypes
}

export interface SystemSetting extends Entity{
  _id: string,
  value?: CompoundTypes
  preload?: boolean
}
