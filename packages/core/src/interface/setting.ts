import { CompoundTypes } from './entities/systemSetting';

export interface Setting{
  name: string,
  description: string,
  defaultValue?: CompoundTypes | (()=> CompoundTypes),
  preload?: boolean,
}
