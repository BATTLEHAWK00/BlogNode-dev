import { AllowedTypes } from './entities/systemSetting';

export interface Setting{
  name: string,
  description: string,
  defaultValue?: AllowedTypes,
  preload?: boolean,
}
