export const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

export class Timer {
  private startTime: Date | null = null;
  private endTime: Date | null = null;
  start() {
    this.startTime = new Date();
  }

  end() {
    this.endTime = new Date();
  }

  result() {
    if (!this.startTime || !this.endTime)
      throw new Error("timer didn't start or stop!");
    if (this.endTime < this.startTime) throw new Error("Usage incorrect");
    return this.endTime.valueOf() - this.startTime.valueOf();
  }

  async decorate(
    decorateFunc: () => void | Promise<void>,
    callback: (result: number) => void
  ) {
    this.start();
    await decorateFunc();
    this.end();
    callback(this.result());
  }
}
