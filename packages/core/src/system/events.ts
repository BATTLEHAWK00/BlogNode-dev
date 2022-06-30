export interface BlogNodeEvents{
  'system/beforeStart': ()=> void
  'system/started': ()=> void
  'system/beforeStop': ()=> void
  'system/gc': ()=> void
  'database/beforeConnecting': ()=> void
  'database/connected': ()=> void
  'task/started': ()=> void
}

export type EventName = keyof BlogNodeEvents;
