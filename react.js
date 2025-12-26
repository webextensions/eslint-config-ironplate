// const globals = require('globals');

import pluginJsxA11y from 'eslint-plugin-jsx-a11y';

import pluginEslintReact from '@eslint-react/eslint-plugin';

import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';

import coreConfig from './_core.js';

const thisConfig = [
    ...coreConfig,

    {
        files: [
            '**/*.cjs',
            '**/*.js',
            '**/*.jsx', // Include .jsx files as well for linting
            '**/*.mjs'
        ]
    },

    {
        plugins: {
            'jsx-a11y': pluginJsxA11y
        },
        rules: {
            ...pluginJsxA11y.configs.recommended.rules
        }
    },

    {
        plugins: {
            react: pluginReact
        },

        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }

            // globals: {
            //     ...globals.browser,
            //     ...globals.jest
            // }
        },

        settings: {
            react: {
                version: 'detect'
            }
        },

        rules: {
            ...pluginReact.configs.flat.recommended.rules,

            'import/extensions': [
                'error',
                'never',
                {
                    ignorePackages: true,
                    pattern: {
                        cjs: 'always',
                        js: 'always',
                        json: 'always',
                        jsx: 'always',
                        mjs: 'always'
                    }
                }
            ],

            // https://github.com/yannickcr/eslint-plugin-react/blob/HEAD/docs/rules/self-closing-comp.md
            'react/self-closing-comp': [
                'error',
                {
                    component: true,
                    html: false
                }
            ]
        }
    },

    {
        plugins: {
            'react-hooks': pluginReactHooks
        },
        rules: {
            ...pluginReactHooks.configs.recommended.rules,

            'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
            'react-hooks/rules-of-hooks': 'error'  // Checks rules of hooks
        }
    },

    {
        plugins: {
            'react-refresh': pluginReactRefresh
        },
        rules: {
            'react-refresh/only-export-components': 'error'
        }
    },

    // Include the @eslint-react/eslint-plugin recommended config (which also contains the plugin definitions)
    {
        ...pluginEslintReact.configs.recommended,
        rules: {
            ...pluginEslintReact.configs.recommended.rules
        }
    }
];

export default thisConfig;
