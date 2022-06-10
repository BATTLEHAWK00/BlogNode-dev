#!/usr/bin/env node
import cac from 'cac';

declare global{
  // eslint-disable-next-line no-var,vars-on-top
  var parsedArgs:any;
}

const cli = cac('blognode');
cli.command('start [loglevel]', 'start BlogNode server')
  .option('--loglevel <trace|debug|info|warn|error>', 'Set log level')
  .action(() => import('../src/entry'));
cli.help();

try {
  global.parsedArgs = cli.parse();
} catch (e) {
  if (e instanceof Error) console.error(e.message);
  process.exit(1);
}

if (!cli.matchedCommand) cli.outputHelp();
