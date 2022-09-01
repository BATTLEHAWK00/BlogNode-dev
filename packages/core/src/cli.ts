import { cac } from 'cac';
import dotenv from 'dotenv';
import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import logging from './system/logging';
import { getImportDirname } from './util/paths';

const isDev = process.env.NODE_ENV === 'development';
const packageInfoPath = path.resolve(getImportDirname(import.meta), isDev ? '../package.json' : '../../package.json');
const packageInfo = JSON.parse(await fs.readFile(packageInfoPath, { encoding: 'utf-8' }));

const cli = cac(packageInfo.version);
const logger = logging.systemLogger;

declare global{
  // eslint-disable-next-line vars-on-top, no-var
  var parsedArgs: {
    options: Record<string, unknown>,
    args: readonly string[]
  };
}

interface BlogNodeEntryConfig{
  entryPath: string
}

function addInfo() {
  cli.version(packageInfo.version);
}

function addHelp() {
  cli.help((sections: { title?: string, body: string }[]) => {
    sections.splice(1, 0, {
      body: `Github repo: ${packageInfo.repository}`,
    });
    return sections;
  });
}

function addGlobalOptions() {
  cli.option('--env <option>', 'Set path of .env file to be loaded');
}

function addCommands(config: BlogNodeEntryConfig) {
  cli.command('start', 'Start BlogNode server')
    .option('--loglevel <trace|debug|info|warn|error>', 'Set log level')
    .action(() => import(config.entryPath));
  cli.command('set <option> <value>', 'Set system option value');
  cli.command('get <option> <value>', 'Get system option value');
  cli.command('').action(() => {
    if (!cli.args.length) cli.outputHelp();
    else logger.error('Invalid command: %s', cli.args.join(' '));
  });
}

function init(config: BlogNodeEntryConfig) {
  addInfo();
  addHelp();
  addGlobalOptions();
  addCommands(config);
}

function start() {
  try {
    global.parsedArgs = cli.parse();
    const envPath = <string | undefined>global.parsedArgs.options.env;
    if (envPath) {
      if (!existsSync(envPath)) throw new Error(".env file doesn't exists.");
      dotenv.config({ path: envPath });
    } else if (existsSync('.env')) dotenv.config({ path: '.env' });
  } catch (e) {
    if (e instanceof Error) logger.error(e.message);
    process.exit(1);
  }
}

export default {
  init,
  start,
};
