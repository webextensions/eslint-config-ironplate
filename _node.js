// const globals = require('globals');

import pluginN from 'eslint-plugin-n';

import { coreConfigs } from './_core.js';

// The rules which the core config already decides. The "flat/recommended" spread below leaves them out, so that each
// rule is decided in exactly one place (otherwise, the spread would silently override the core configuration of eg:
// "n/no-missing-require" with its own options).
const coreRuleIds = new Set(coreConfigs.flatMap((config) => Object.keys(config.rules ?? {})));

const nRecommendedRulesNotInCore = Object.fromEntries(
    Object.entries(pluginN.configs['flat/recommended'].rules).filter(([ruleId]) => !coreRuleIds.has(ruleId))
);

// The Node.js-specific config objects (the "node" feature of createIronplateConfig())
const nodeConfigs = [
    // {
    //     languageOptions: {
    //         globals: {
    //             ...globals.commonjs,
    //             ...globals.jest,
    //             ...globals.node
    //         }
    //     }
    // },

    {
        name: 'ironplate/node/n',

        plugins: {
            n: pluginN
        },
        rules: {
            // "n/callback-return", "n/no-exports-assign" and "n/no-missing-require" are configured in _core.js
            ...nRecommendedRulesNotInCore,

            'n/hashbang': 'off',
            'n/no-deprecated-api': ['error'],
            'n/no-extraneous-import': 'off',
            'n/no-extraneous-require': 'off',

            // Rather than "n/no-missing-import", use "import/no-unresolved" / "import-x/no-unresolved"
            // Ref: https://github.com/eslint-community/eslint-plugin-n/issues/349#issuecomment-2393189937
            'n/no-missing-import': 'off',

            // eg: `path.join(__dirname, 'x')` rather than `__dirname + '/x'`
            'n/no-path-concat': ['error'],

            'n/no-unpublished-import': 'off',
            'n/no-unpublished-require': 'off',

            // Without the `ignores: ['modules']` of the "flat/recommended" spread above, ie: the ES module syntax
            // (import / export) is also checked against the project's Node.js version
            'n/no-unsupported-features/es-syntax': ['error']

            // The "n/no-unsupported-features/*" rules ("es-syntax" above, "es-builtins" and "node-builtins" as set by
            // the "flat/recommended" spread) are used without a "version" option. A rule-level "version" would
            // override the project's own setting; without it, eslint-plugin-n checks against (in this order) the
            // project's `settings: { n: { version } }`, the "engines.node" of the project's package.json, its
            // "devEngines.runtime", and finally ">=16.0.0".
        }
    },

    {
        name: 'ironplate/node/esm-globals',

        // All the linted files except the CommonJS ones (.cjs / .cts): ESLint treats the others as ES modules by
        // default. Projects whose .js / .ts files are CommonJS (eg: `"type": "commonjs"`, or TypeScript compiled to
        // CommonJS) can turn this rule off for those files.
        // Uses "ignores" (rather than "files"), since in flat config, a "files" pattern like "**/*.ts" would also make
        // ESLint lint those files, eg: TypeScript files in a project using the JavaScript-only "node.js" preset.
        ignores: ['**/*.cjs', '**/*.cts'],

        rules: {
            // "__dirname" and "__filename" exist only in CommonJS modules. The messages also name the fallbacks, since
            // "import.meta.dirname" / "import.meta.filename" are stable only from Node.js 22.16.0 (and below that,
            // "n/no-unsupported-features/node-builtins" reports them).
            'no-restricted-globals': [
                'error',
                {
                    name: '__dirname',
                    message: 'Not available in ES modules. Use "import.meta.dirname" (or, for Node.js < 22.16, "path.dirname(fileURLToPath(import.meta.url))").'
                },
                {
                    name: '__filename',
                    message: 'Not available in ES modules. Use "import.meta.filename" (or, for Node.js < 22.16, "fileURLToPath(import.meta.url)").'
                }
            ]
        }
    }
];

const createNodeConfigs = function () {
    return nodeConfigs;
};

export { createNodeConfigs };
