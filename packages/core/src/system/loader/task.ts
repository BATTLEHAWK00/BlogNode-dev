import bus from '@src/system/bus';
import { SystemLoader } from '@src/system/manager/loader';
import task from '@src/system/task';
import { WaitFunction } from '@src/util/sequencer';

class TaskLoader extends SystemLoader {
  async load(wait: WaitFunction): Promise<void> {
    await wait(['db']);
    bus.once('system/beforeStop', task.stop);
    await task.start();
  }
}

export default new TaskLoader('task');
