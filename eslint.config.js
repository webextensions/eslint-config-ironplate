import globals from 'globals';

import eslintIronPlateConfigNode from './node.js';

const config = [
    {
        ignores: [
            'test/'
        ]
    },

    ...eslintIronPlateConfigNode,

    {
        files: ['*.cjs'],
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    },

    {
        files: ['*.js', '*.mjs'],
        languageOptions: {
            globals: {
                ...globals.nodeBuiltin
            }
        },
        rules: {
            'import/no-default-export': 'off'
        }
    }
];

export default config;
