import bus from '@src/system/bus';
import { SystemMiddleware } from '@src/system/middleware';
import task from '@src/system/task';

class TaskMiddleware extends SystemMiddleware {
  onInit(): void | Promise<void> {
    bus.once('database/connected', task.start);
  }

  onRegisterEvents(): void | Promise<void> {
    bus.once('system/beforeStop', task.stop);
  }
}

export default new TaskMiddleware();
