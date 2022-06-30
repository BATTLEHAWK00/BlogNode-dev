import bus from '@src/system/bus';
import email from '@src/system/email';
import { SystemMiddleware } from '@src/system/middleware';

class EmailMiddleware extends SystemMiddleware {
  onInit(): void {
    email.init(
      {
        host: 'localhost',
        port: 123,
        secure: false,
        username: 'test',
        password: 'test',
      },
    );
  }

  onRegisterEvents(): void {
    bus.once('system/beforeStop', () => email.close());
  }
}

export default new EmailMiddleware();
