import globals from 'globals';
import pluginStylistic from '@stylistic/eslint-plugin';

import eslintIronplateConfigNode from 'eslint-config-ironplate/node.js';

// TODO: Simplify this configuration

const config = [
    ...eslintIronplateConfigNode,

    {
        ignores: [
            'eslint.config.js'
        ]
    },

    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jquery
            }
        },

        rules: {
            '@stylistic/comma-dangle': ['error', 'never'],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/indent': [
                'error',
                4,
                {
                    'SwitchCase': 1, // https://eslint.style/rules/js/indent#switchcase
                    'ignoreComments': true // https://eslint.style/rules/js/indent#ignorecomments
                }
            ],

            'no-restricted-globals': ['error', { name: '__dirname' }]
        }
    }
];

export default config;
