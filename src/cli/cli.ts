import { program } from 'commander';

import version from './../version';
import { generate } from './commands';

interface CLIOptions {
  config: string;
  outDir?: string;
  silent: boolean;
}

// Example
// `apify-actor-config-utils gen/generate -c/--config ./actor.ts -o/--out ./.actor/actor.json`
program
  .name('apify-actor-config')
  .description('Utils for working with Apify actor config')
  .version(version)
  .addHelpText(
    'after',
    `

Example call:
  $ apify-actor-config gen -c ./actor.js -o ./.actor/actor.json`
  );

program
  .command('gen')
  .description('Generate actor.json from given js config file')
  .option('-c, --config <config-path>', 'path to actor config')
  .option(
    '-o, --out-dir [output-path]',
    'path to dir where the actor.json is exported. By default exports to "./.actor" if it exists, otherwise to "./"'
  )
  .option('-s, --silent', 'do not write log messages to stdout')
  .action(async (options: CLIOptions) => {
    await generate(options);
  });

export const cli = () => {
  program.parse();
};
