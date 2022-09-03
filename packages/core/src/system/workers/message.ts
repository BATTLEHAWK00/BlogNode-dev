class WorkerMessage {
    readonly id='BlogNodeWorkerMessage';
    readonly eventName: string
    readonly payloads: unknown[]
    constructor(name: string, payloads: unknown[]) {
      this.eventName = name;
      this.payloads = payloads;
    }
}

// eslint-disable-next-line import/prefer-default-export
export function createWorkerMessage(name: string, payloads: unknown[] = []) {
  return new WorkerMessage(name, payloads);
}
