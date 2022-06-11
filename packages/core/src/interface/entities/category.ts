import { Entity } from '../interface';

export interface Category extends Entity{
  displayName: string,
  name: string,
  description: string
}
