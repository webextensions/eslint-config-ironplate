import globals from 'globals';

import eslintIronplateConfigNode from './node.js';

const config = [
    {
        ignores: [
            'test/'
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
        files: ['*.js', '*.mjs', 'scripts/**/*.js'],
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
