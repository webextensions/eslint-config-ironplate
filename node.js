// const globals = require('globals');

import pluginN from 'eslint-plugin-n';

import coreConfig from './_core.js';

// The Node.js-specific additions on top of the core config (exported for composite configs, eg: node-typescript.js)
const nodeDelta = [
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
        rules: {
            'import-x/extensions': [
                'error',
                'never',
                {
                    ignorePackages: true,
                    pattern: {
                        cjs: 'always',
                        js: 'always',
                        json: 'always',
                        mjs: 'always'
                    }
                }
            ]
        }
    },

    {
        plugins: {
            n: pluginN
        },
        rules: {
            // "n/callback-return", "n/no-exports-assign", "n/no-missing-require" and
            // "n/no-unsupported-features/es-syntax" are configured in _core.js
            ...pluginN.configs['flat/recommended'].rules,

            'n/hashbang': 'off',
            'n/no-deprecated-api': ['error'],
            'n/no-extraneous-import': 'off',
            'n/no-extraneous-require': 'off',

            // Rather than "n/no-missing-import", use "import/no-unresolved" / "import-x/no-unresolved"
            // Ref: https://github.com/eslint-community/eslint-plugin-n/issues/349#issuecomment-2393189937
            'n/no-missing-import': 'off',

            'n/no-unpublished-import': 'off',
            'n/no-unpublished-require': 'off',

            // Re-asserted here (already configured in _core.js) because the "flat/recommended" spread above would
            // otherwise override the core configuration of this rule with its own options
            'n/no-unsupported-features/es-syntax': ['error', {
                version: '>=20'
            }],

            'n/no-unsupported-features/node-builtins': ['error', {
                version: '>=20'
            }]
        }
    }
];

const thisConfig = [
    ...coreConfig,
    ...nodeDelta
];

export { nodeDelta };
export default thisConfig;
