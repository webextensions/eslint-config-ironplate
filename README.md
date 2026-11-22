# eslint-config-ironplate
Shareable ESLint configuration

## Installation
`$ npm install --save-dev eslint-config-ironplate`

When you run this installation command, you will also see a guide about installing peerDependencies.

Note: The react-family peerDependencies (`@eslint-react/eslint-plugin`, `eslint-plugin-react-hooks`,
`eslint-plugin-react-refresh`) are optional and only needed when using the react configs. Similarly, `typescript`
and `typescript-eslint` are optional and only needed when using the TypeScript configs.

## Example usages
In `eslint.config.js` / `eslint.config.mjs` file, use it like one of the following combinations:
```js
import eslintConfigIronplate from 'eslint-config-ironplate';
// OR import eslintConfigIronplateNode            from 'eslint-config-ironplate/node.js';
// OR import eslintConfigIronplateReact           from 'eslint-config-ironplate/react.js';
// OR import eslintConfigIronplateTypeScript      from 'eslint-config-ironplate/typescript.js';
// OR import eslintConfigIronplateNodeTypeScript  from 'eslint-config-ironplate/node-typescript.js';
// OR import eslintConfigIronplateReactTypeScript from 'eslint-config-ironplate/react-typescript.js';

export default [
    ...eslintConfigIronplate
    // OR ...eslintConfigIronplateNode
    // OR ...eslintConfigIronplateReact
    // OR ...eslintConfigIronplateTypeScript
    // OR ...eslintConfigIronplateNodeTypeScript
    // OR ...eslintConfigIronplateReactTypeScript

    // ... project specific configuration ...
];
```

Note: For the TypeScript configs, no `languageOptions.parser` setup is needed - the parser comes bundled (via the
`typescript-eslint` package).

## Config factory
The presets above are fixed combinations of three features: `node`, `react` and `typescript`. To pick any
combination (including ones without a preset file, eg: Node.js + React + TypeScript in one package), use the async
`createIronplateConfig()` factory:
```js
import { createIronplateConfig } from 'eslint-config-ironplate';

export default [
    ...(await createIronplateConfig({ node: true, react: true, typescript: true }))

    // ... project specific configuration ...
];
```

- All the options are booleans and default to `false`. `createIronplateConfig()` (no options) gives the same config as
  `eslint-config-ironplate`, and eg: `createIronplateConfig({ node: true, typescript: true })` the same as
  `eslint-config-ironplate/node-typescript.js`.
- It is async because it loads the optional peerDependencies (the react-family plugins, `typescript` and
  `typescript-eslint`) only for the features that need them. If one of them is missing, it fails with a message naming
  the packages to install.
- Unknown options (eg: a typo like `{ ts: true }`) throw a `TypeError` instead of silently producing a config without
  that feature.

## Globals
These configs intentionally do not declare any language globals, since the right set depends on where your code
runs (Node.js, browser, tests etc.). Without declaring them, the `no-undef` rule would flag identifiers like
`process`, `window` and `document`.

Declare the globals your project runs under via the `globals` package (it is already available as a peerDependency
of this package):
```js
import globals from 'globals';

import eslintConfigIronplateNode from 'eslint-config-ironplate/node.js';

export default [
    ...eslintConfigIronplateNode,

    {
        languageOptions: {
            globals: {
                ...globals.node     // For Node.js projects
                // ...globals.browser  // For browser / React projects
            }
        }
    }
];
```

Note: Some other useful sets are `globals.nodeBuiltin` (Node.js ESM) and `globals.jest`. To apply different globals
to different parts of the project, use multiple config objects scoped via `files`, eg:
`{ files: ['**/*.test.js'], languageOptions: { globals: { ...globals.jest } } }`.

## Supported Node.js version
In the Node.js configs (`node.js`, `node-typescript.js`, or the `node` feature of `createIronplateConfig()`), the
`n/no-unsupported-features/*` rules (`es-syntax`, `es-builtins`, `node-builtins`) report language features and Node.js
APIs which are not available in the Node.js versions your project supports. These configs don't set a version for
them, so they follow your project, in this order:
- `settings: { n: { version } }` in your ESLint config, when set
- otherwise the `engines.node` field of your `package.json` (then its `devEngines.runtime`)
- otherwise `>=16.0.0`

To pin the version explicitly (eg: when using `eslint --cache`, since a cached result doesn't get re-checked when only
`package.json` changes), set it once:
```js
export default [
    ...eslintConfigIronplateNode,

    {
        settings: {
            n: {
                version: '>=24.2.0'
            }
        }
    }
];
```

Note: The Node.js configs also report `__dirname` / `__filename` in the files which ESLint treats as ES modules (`.js`,
`.mjs`, `.ts`, `.mts`), since they exist only in CommonJS (use `import.meta.dirname` / `import.meta.filename`). If your
`.js` / `.ts` files are CommonJS, turn the rule off for them, eg:
`{ files: ['**/*.js'], rules: { 'no-restricted-globals': 'off' } }`.
