import pluginDao from '@src/orm/dao/pluginDao';
import fs from 'fs/promises';
import vm from 'vm';
import { BlogNodeError } from '../error';

abstract class BlogNodePlugin {
  private dependencies: string[] = [];
  abstract onLoad(): void | Promise<void>;
  abstract onUnLoad(): void | Promise<void>;
  abstract onEnable(): void | Promise<void>;
  abstract onDisable(): void | Promise<void>;
  abstract pluginName(): string;
  setDependencies(deps: string[]): void {
    this.dependencies = deps;
  }
}

const pluginCodeCache: Map<string, Buffer> = new Map();

const loadedPlugins: Map<string, BlogNodePlugin> = new Map();

const pluginContext = {
  BlogNodePlugin,
  async registerPlugin(plugin: BlogNodePlugin) {
    await plugin.onLoad();
    loadedPlugins.set(plugin.pluginName(), plugin);
  },
};

async function loadPlugin(fileName: string): Promise<void> {
  const code = await fs.readFile(fileName, { encoding: 'utf-8' });
  const script = new vm.Script(code, { displayErrors: true });
  const buffer = script.createCachedData();
  pluginCodeCache.set(fileName, buffer);
  script.runInContext(pluginContext);
}

function flushCodeCache(): void {
  pluginCodeCache.clear();
}

async function unloadPlugin(name: string): Promise<void> {
  const plugin = loadedPlugins.get(name);
  if (!plugin) throw new BlogNodeError(`Plugin ${name} doesn't exist.`);
  await plugin.onUnLoad();
  loadedPlugins.delete(name);
}

async function loadEnabledPlugins(): Promise<void> {
  const plugins = await pluginDao.getPlugins();
  await Promise.all(
    plugins.filter((p) => p.enable)
      .map((p) => p._id)
      .map((p) => loadPlugin(p)),
  );
}

export default {
  loadEnabledPlugins,
  flushCodeCache,
  unloadPlugin,
};
