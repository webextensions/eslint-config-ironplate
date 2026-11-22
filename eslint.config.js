import globals from 'globals';

import eslintIronplateConfigNode from './node.js';

const config = [
    {
        ignores: [
            // The fixture projects ("test/<preset>/") have their own ESLint config and node_modules (they are linted
            // by "npm run test:data"); the test files directly under "test/" are linted like the rest of this package
            'test/*/'
        ]
    },

    ...eslintIronplateConfigNode,

    {
        files: ['*.cjs'],
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    },

    {
        files: ['*.js', '*.mjs', 'scripts/**/*.js', 'test/*.js'],
        languageOptions: {
            globals: {
                ...globals.nodeBuiltin
            }
        },
        rules: {
            'import-x/no-default-export': 'off'
        }
    }
];

export default config;
