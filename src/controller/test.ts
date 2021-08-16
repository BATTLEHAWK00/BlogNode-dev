import { Controller } from '../service/controller';

class TestController extends Controller {
  get() {
    this.ctx.response.body = 'Hello World!';
  }
}

export default {
  TestController,
};
