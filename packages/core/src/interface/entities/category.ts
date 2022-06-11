import { Entity } from './base';

export interface Category extends Entity{
  displayName: string,
  name: string,
  description: string
}
