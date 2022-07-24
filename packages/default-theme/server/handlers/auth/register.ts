import { ApiResult, ApiHandler } from '../../util/handler';

class RegisterApiHandler extends ApiHandler {
  async get(): Promise<ApiResult> {
    return {
      code: 200,
      msg: 'OK',
      data: 'asdasd',
    };
  }
}

export default new RegisterApiHandler('RegisterApi', '/auth/register');
