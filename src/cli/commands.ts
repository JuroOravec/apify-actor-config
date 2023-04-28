import fs from 'fs';
import fsp from 'fs/promises';

import type { ActorConfig } from '../types/config';

type MaybePromise<T> = T | Promise<T>;
type MaybeAsyncFn<R, Args extends any[]> = R | ((...args: Args) => MaybePromise<R>);

/** Given a path to a config .js file, resolve the config and export it as JSON to out path */
export const generate = async ({
  config: configPath,
  out: outPath,
  silent,
}: {
  /** Path to config file */
  config: string;
  /** Path where the actor.json will be generated */
  out?: string;
  silent?: boolean;
}) => {
  const log = silent ? () => {} : console.log;

  log(`Importing config file from ${configPath}`);

  const configOrInit = require(configPath) as MaybeAsyncFn<ActorConfig, []>;
  if (!configOrInit || ['function', 'object'].includes(typeof configOrInit)) {
    throw Error(`Failed to import Actor config from path ${configPath}, got ${configOrInit} instead`); // prettier-ignore
  }

  log(`Config found! Resolving...`);
  const resolvedConfig = typeof configOrInit === 'function' ? await configOrInit() : configOrInit;
  if (!resolvedConfig || typeof configOrInit !== 'object') {
    throw Error(`Failed to import Actor config from path ${configPath}, config did not resolve to object, got ${configOrInit} instead`); // prettier-ignore
  }
  if (!resolvedConfig.actorSpecification) {
    throw Error(`Invalid Actor config object imported from path ${configPath}, config.actorSpecification is missing`); // prettier-ignore
  }

  const jsonConfig = JSON.stringify(resolvedConfig);

  const resolvedOutPath = outPath || fs.existsSync('./.actor') ? './.actor' : '.';
  log(`Writing resolved config to file ${resolvedOutPath}`);

  await fsp.mkdir(resolvedOutPath, { recursive: true });
  await fsp.writeFile(resolvedOutPath, jsonConfig, 'utf-8');

  log(`Done!`);
};
