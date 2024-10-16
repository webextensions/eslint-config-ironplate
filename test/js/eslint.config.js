const globals = require('globals');
const pluginStylistic = require('@stylistic/eslint-plugin');

const eslintIronPlateConfigNode = require('eslint-config-ironplate/node.js');
const { languageOptions } = require('eslint-plugin-import/config/flat/react.js');

// TODO: Simplify this configuration

module.exports = [
    ...eslintIronPlateConfigNode,

    {
        ignores: [
            'eslint.config.js'
        ]
    },

    {
        files: ['**/*.js'],

        languageOptions: {
            globals: {
                ...globals.jquery
            }
        },

        rules: {
            ...pluginStylistic.configs['recommended-flat'].rules, // https://eslint.style/rules

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
