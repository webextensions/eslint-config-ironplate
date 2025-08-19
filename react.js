const globals = require('globals');

const pluginReact = require('eslint-plugin-react');
const pluginReactHooks = require('eslint-plugin-react-hooks');
const pluginReactRefresh = require('eslint-plugin-react-refresh');

const coreConfig = require('./_core.js');

let thisConfig = coreConfig;

thisConfig = [
    ...thisConfig,

    {
        plugins: {
            react: pluginReact,
            'react-hooks': pluginReactHooks,
            'react-refresh': pluginReactRefresh
        },

        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },

            globals: {
                ...globals.browser,
                ...globals.jest
            }
        },

        settings: {
            react: {
                version: 'detect'
            }
        },

        rules: {
            ...pluginReact.configs.flat.recommended.rules,
            ...pluginReactHooks.configs.recommended.rules,

            "import/extensions": [
                "error",
                "never",
                {
                    ignorePackages: true,
                    pattern: {
                        "cjs": "always",
                        "js": "always",
                        "json": "always",
                        "jsx": "always",
                        "mjs": "always"
                    }
                }
            ],

            "react/prop-types": ["error"],

            // https://github.com/yannickcr/eslint-plugin-react/blob/HEAD/docs/rules/self-closing-comp.md
            "react/self-closing-comp": [
                "error",
                {
                    "component": true,
                    "html": false
                }
            ],

            "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
            "react-hooks/rules-of-hooks": "error", // Checks rules of hooks

            "react-refresh/only-export-components": "error"
        }
    }
];

module.exports = [...thisConfig];
