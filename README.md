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
