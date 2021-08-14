

type logType= 'debug'|'info'|'success'|'warn'|'error'|'fatal'
type LogFunction = (format: any, ...param: any[]) => void;
export interface Logger extends Record<logType, LogFunction> { }

/**
 * Logger
 */
export class Logger {
  private prefix: string
  /**
   * @param {string} prefix
   */
  constructor(prefix: string) {
    this.prefix=prefix;
    this.createLogMethod('debug', this.prefix, 0);
    this.createLogMethod('info', this.prefix, 0);
    this.createLogMethod('success', this.prefix, 0);
    this.createLogMethod('warn', this.prefix, 0);
    this.createLogMethod('error', this.prefix, 0);
    this.createLogMethod('fatal', this.prefix, 0);
  }


  /**
   * @param {logType} name
   * @param {string} prefix
   * @param {number} minLevel
   */
  private createLogMethod(name:logType, prefix:string, minLevel:number) {
    this[name] = function(message: string) {
      const msg: string =
      // eslint-disable-next-line max-len
      `${new Date(Date.now()).toISOString()} | ${name.toUpperCase()} ${prefix} - ${message}`;
      console.log(msg);
    };
  }
}
