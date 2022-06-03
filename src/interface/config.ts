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
  userName: string;
  password: string;
  dbName: string;
}

export interface NextConfig {
  dev: boolean;
}
