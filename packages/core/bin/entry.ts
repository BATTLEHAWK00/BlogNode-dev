#!/usr/bin/env node
import cac from 'cac';
import dotenv from 'dotenv';
import fs from 'fs';

declare global{
  // eslint-disable-next-line no-var,vars-on-top
  var parsedArgs:{
    options:any,
    args:any
  };
}

const cli = cac('blognode');

cli.help();

cli.option('--env <option>', 'Set path of .env file to load');

cli.command('start', 'Start BlogNode server')
  .option('--loglevel <trace|debug|info|warn|error>', 'Set log level')
  .action(() => import('../src/entry'));

cli.command('set <option> <value>', 'Set system option value');

cli.command('get <option> <value>', 'Get system option value');

cli.command('').action(() => {
  if (!cli.args.length) cli.outputHelp();
  else console.error('Invalid command: %s', cli.args.join(' '));
});

try {
  global.parsedArgs = cli.parse();
  const envPath = global.parsedArgs.options.env;
  if (envPath) {
    if (!fs.existsSync(envPath)) throw new Error(".env file doesn't exists.");
    dotenv.config({ path: envPath });
  } else if (fs.existsSync('.env')) dotenv.config({ path: '.env' });
} catch (e) {
  if (e instanceof Error) console.error(e.message);
  process.exit(1);
}
