import { Entity } from './base';

export type AllowedTypes<T> = string | number | SettingObject<T> | boolean | Array<T> | Date;

export interface SettingObject<T>{
  [key: string]: AllowedTypes<T>
}

export interface SystemSetting<T> extends Entity{
  _id: string,
  value: AllowedTypes<T>
  preload?: boolean
}
