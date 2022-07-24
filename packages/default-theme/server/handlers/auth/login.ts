import { ApiResult, ApiHandler } from '../../util/handler';

class LoginApiHandler extends ApiHandler {
  async get(): Promise<ApiResult> {
    return {
      code: 200,
      msg: 'OK',
      data: 'asdasd',
    };
  }
}

export default new LoginApiHandler('LoginApi', '/auth/login');
