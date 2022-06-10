import mongoose from 'mongoose';

export interface CompressionConfig {
  threshold: number;
}

export interface HttpConfig {
  address: string;
  port: number;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  userName?: string;
  password?: string;
  dbName: string;
  options?: Partial<mongoose.ConnectOptions>
}

export interface NextConfig {
  dev: boolean;
}

export interface SystemConfig{
  blogName:string,
  themeDir?:string,
  faviconPath?:string
  logLevel?:'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
}
