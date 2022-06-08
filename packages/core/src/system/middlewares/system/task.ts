import bus from '@src/system/bus';
import { EventType } from '@src/system/events';
import { SystemMiddleware } from '@src/system/middleware';
import task from '@src/system/task';

class TaskMiddleware extends SystemMiddleware {
  onInit(): void | Promise<void> {
    bus.once(EventType.SYS_DatabaseConnected, task.start);
  }

  onRegisterEvents(): void | Promise<void> {
    bus.once(EventType.SYS_BeforeSystemStop, task.stop);
  }
}

export default new TaskMiddleware();
