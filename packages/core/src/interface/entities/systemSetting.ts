type AllowedTypes = string | number | SettingObject | boolean | Array<any> | Date;

export interface SettingObject{
  [key:string]:AllowedTypes
}

export interface SystemSetting{
  _id:string,
  value:AllowedTypes
  preload?:boolean
}
