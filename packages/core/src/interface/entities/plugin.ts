import { Entity } from './base';

export interface Plugin extends Entity{
  _id: string
  downloadedAt: Date
  lastLoad: Date
  enable: boolean
  data: Record<string, unknown>
}
