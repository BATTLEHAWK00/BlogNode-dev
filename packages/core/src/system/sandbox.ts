import fs from 'fs/promises';
import Module from 'module';
import path from 'path';
import vm from 'vm';
import config from './config';

const vmContext = {
  isDev: config.isDev,
};

interface IModuleContext extends Record<string, unknown>{
  __filename: string
  __dirname: string
  module: Record<string, unknown>
  exports: Record<string, unknown>
  require: NodeRequire
}

async function runModuleInSandbox<T>(filePath: string, context: Record<string, unknown>): Promise<T> {
  const code = await fs.readFile(filePath, { encoding: 'utf-8' });
  const script = new vm.Script(code, { displayErrors: true, filename: filePath });
  const ctx: IModuleContext = {
    require: Module.createRequire(filePath),
    __dirname: path.dirname(filePath),
    __filename: filePath,
    module: {},
    exports: {},
    ...vmContext,
    ...context,
  };
  return script.runInContext(vm.createContext(ctx));
}

function runCodeInSandbox<T>(code: string, context: Record<string, unknown>): Promise<T> {
  const script = new vm.Script(code, { displayErrors: true });
  const ctx = {
    ...vmContext,
    ...context,
  };
  return script.runInContext(vm.createContext(ctx));
}

export default {
  runModuleInSandbox,
  runCodeInSandbox,
};
