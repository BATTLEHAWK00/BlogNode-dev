import { ApiResult, ApiHandler } from '../../util/handler';

class LogoutApiHandler extends ApiHandler {
  async get(): Promise<ApiResult> {
    return {
      code: 200,
      msg: 'OK',
      data: 'asdasd',
    };
  }
}

export default new LogoutApiHandler('LogoutApi', '/auth/logout');
