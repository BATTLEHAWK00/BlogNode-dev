import { Entity } from './base';

export interface Cache extends Entity{
  _id: string
  namespace: string
  value: unknown
  ttl: number
  updateTime: number
}
