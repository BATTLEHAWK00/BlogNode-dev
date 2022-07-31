import { Client, ClientOptions } from 'minio';

class MinioStorage {
  private config: ClientOptions;

  private client?: Client;

  constructor(config: ClientOptions) {
    this.config = config;
  }

  init() {
    this.client = new Client(this.config);
  }
}
