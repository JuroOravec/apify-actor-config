# Apify actor config

Write [Apify actor config](https://docs.apify.com/platform/actors/development/actor-config) in JS/TS 😇

## Features
- Defined Apify's `actor.json` in JS/TS
- Use CLI to export `actor.js` to JSON
- Types for the Actor config

## Getting started

### Install

```sh
npm i apify-actor-config
```

### Write Actor config in JS/TS

The file must export the config as the **default export**

See full example in [./examples/config.ts](./examples/config.ts).

```ts
import {
  createActorConfig,
  createActorInputSchema,
  createBooleanField,
  createIntegerField,
  createObjectField,
  createStringField,
  createArrayField,
  Field,
  ActorInputSchema,
} from 'apify-actor-config';

// Define fields, typed based on their "type" and "editor" properties.
const proxyInput: Record<'proxy', Field> = {
  proxy: createObjectField({
    title: 'Proxy configuration',
    type: 'object',
    description: 'Select proxies to be used by your crawler.',
    editor: 'proxy',
    sectionCaption: 'Proxy',
    sectionDescription: 'Configure the proxy',
  }),
};

// Define input schema
const inputSchema = createActorInputSchema<ActorInputSchema<Record<keyof ActorInput, Field>>>({
  schemaVersion: 1,
  title: 'Example Scraper',
  description: `Configure the Example Scraper.`,
  type: 'object',
  properties: {
    ...proxyInput,
  },
});

// Define output schema
const outputSchema = createActorOutputSchema({
  schemaVersion: 1,
  fields: {
    /** ... */
  },
  views: {
    /** ... */
  },
});

// Now put it all together into Actor config
const config = createActorConfig({
  actorSpecification: 1,
  name: 'example-scraper',
  title: 'Example Scraper',
  description: 'Actor config example showcasing config written in JS/TS',
  version: '0.1',
  dockerfile: './Dockerfile',
  input: inputSchema,
});

// IMPORTANT: Export as default
export default config;
```

### Generate actor.json

If you use TS, first compile the project.

Then generate `actor.json` file with `apify-actor-config gen` command.

Use `-c` or `--config` option to specify path to config JS file:

```sh
npx apify-actor-config gen -c ./path/to/config.js
```

By default, `actor.json` will be saved to `./.actor` directory, if it exists, or otherwise to your current working directory.

To specify the output directory, set the `-o` or `--output` option

```sh
npx apify-actor-config gen -c ./path/to/config.js -o ./other/path/dir
```

> To see all options, use
>
> ```sh
> npx apify-actor-config gen -h
> ```

## Types

This library provides full typing for all Actor config objects:
- [ActorConfig](./src/types/config.ts)
- [ActorInputSchema](./src/types/inputSchema.ts)
  - Field types: StringField, BooleanField, IntegerField, ObjectField, ArrayField
- [ActorOutputSchema](./src/types/outputSchema.ts)
  - DatasetView
  - ViewTransformation
  - ViewDisplay
    - ViewDisplayProperty

Included are also helper functions to create typed objects:
- [ActorConfig](./src/types/config.ts)
  - createActorConfig
- [ActorInputSchema](./src/types/inputSchema.ts)
  - createActorInputSchema
  - createStringField
  - createBooleanField
  - createIntegerField
  - createObjectField
  - createArrayField
- [ActorOutputSchema](./src/types/outputSchema.ts)
  - createActorOutputSchema

See the files in [./src/types](./src/types/) directory for full details.