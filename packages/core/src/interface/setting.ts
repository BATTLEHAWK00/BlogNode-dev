import { AllowedTypes } from './entities/systemSetting';

export interface Setting<T>{
  name: string,
  description: string,
  defaultValue?: AllowedTypes<T>,
  preload?: boolean,
}
