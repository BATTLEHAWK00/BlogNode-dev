#!/usr/bin/env node
import cac from 'cac';

declare global{
  // eslint-disable-next-line no-var,vars-on-top
  var parsedArgs:any;
}

const cli = cac('blognode');

cli.help();

cli.command('start [loglevel]', 'Start BlogNode server')
  .option('--loglevel <trace|debug|info|warn|error>', 'Set log level')
  .action(() => import('../src/entry'));

cli.command('set <option> <value>', 'Set system option value');

cli.command('get <option> <value>', 'Get system option value');

cli.command('').action(() => {
  if (!cli.args.length) cli.outputHelp();
  else console.error('Invalid command: %s', cli.args.join(''));
});

try {
  global.parsedArgs = cli.parse();
} catch (e) {
  if (e instanceof Error) console.error(e.message);
  process.exit(1);
}
