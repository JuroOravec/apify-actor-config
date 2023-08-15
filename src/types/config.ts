import type { ActorInputSchema } from './inputSchema';
import type { ActorOutputSchema } from './outputSchema';

/** See https://docs.apify.com/platform/actors/development/actor-config */
export interface ActorConfig<
  TInputSchema extends ActorInputSchema = ActorInputSchema,
  TOutputSchema extends ActorOutputSchema = ActorOutputSchema,
  TEnvVars extends Record<string, string> = Record<string, string>
> {
  /**
   * The version of the specification against which your schema is written.
   * Currently, only version 1 is out.
   */
  actorSpecification: 1;
  /** Name of the scraper */
  name?: string;
  /** e.g. '0.0' */
  version?: string;
  /** e.g. 'latest' */
  buildTag?: string;
  /**
   * @example
   * {
   *   MYSQL_USER: 'my_username',
   *   MYSQL_PASSWORD: '@mySecretPassword',
   * }
   */
  environmentVariables?: TEnvVars;
  /**
   * If you specify the path to your Docker file under the dockerfile field,
   * this file will be used for actor builds on the platform. If not specified,
   * the system will look for Docker files at .actor/Dockerfile and Dockerfile,
   * in this order of preference.
   *
   * Example: `'./Dockerfile'`
   */
  dockerfile?: string;
  /**
   * Specifies the path to the directory used as the Docker context when building
   * the Actor. The path is relative to the location of the actor.json file. Useful
   * for having a monorepo with multiple Actors.
   */
  dockerContextDir?: string;
  /**
   * If you specify the path to your README file under the readme field, the README
   * at this path will be used on the platform. If not specified,
   * README at .actor/README.md or README.md will be used, in this order of preference.
   *
   * Example: `'./ACTOR.md'`
   */
  readme?: string;
  /**
   * You can embed your input schema object directly in actor.json under the input field.
   * Alternatively, you can provide a path to a custom input schema. If not provided,
   * the input schema at .actor/INPUT_SCHEMA.json or INPUT_SCHEMA.json is used,
   * in this order of preference.
   *
   * Example: `'./input_schema.json'`
   */
  input?: string | TInputSchema;
  storages?: {
    /**
     * You can define the schema of the items in your dataset under the storages.dataset field.
     * This can be either an embedded object or a path to a JSON schema file.
     *
     * Read more about actor output schema at
     * https://docs.apify.com/platform/actors/development/output-schema#specification-version-1
     *
     * Example: `'./dataset_schema.json'`
     */
    dataset?: string | TOutputSchema;
  };
  /**
   * Specifies the minimum amount of memory in megabytes that an Actor requires to run.
   * Requires an integer value. If both minMemoryMbytes and maxMemoryMbytes are set, then
   * minMemoryMbytes must be the same or lower than maxMemoryMbytes.
   */
  minMemoryMbytes?: number;
  /**
   * Specifies the maximum amount of memory in megabytes that an Actor requires to run.
   * It can be used to control the costs of run, especially when developing pay per result
   * actors. Requires an integer value.
   */
  maxMemoryMbytes?: number;
  meta?: object;
}

export const createActorConfig = <T extends ActorConfig>(config: T) => config;
