// ESLint Shareable configs documentation:
//     https://eslint.org/docs/latest/extend/shareable-configs
//
// Note:
//     To list install peerDependencies:
//         $ npm info "eslint-config-ironplate" peerDependencies
//     To install peerDependencies:
//         $ npx install-peerdeps --dev eslint-config-ironplate
// Reference:
//     https://www.npmjs.com/package/eslint-config-airbnb/v/18.0.1

// TODO:
//     Create "eslint-config-ironplate/base.js" which doesn't use any plugins

const eslintJs = require('@eslint/js');

const pluginStylistic = require('@stylistic/eslint-plugin');
const pluginImport = require('eslint-plugin-import');
const pluginN = require('eslint-plugin-n');
const pluginUnicorn = require('eslint-plugin-unicorn').default;

module.exports = [
    {
        plugins: {
            '@stylistic': pluginStylistic,
            import: pluginImport,
            n: pluginN,
            unicorn: pluginUnicorn
        },

        languageOptions: {
            globals: {
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly'
            }
        },

        // https://eslint.org/docs/latest/use/configure/configuration-files#configuring-shared-settings
        settings: {},

        rules: {
            ...eslintJs.configs.recommended.rules,
            ...pluginStylistic.configs['recommended-flat'].rules, // https://eslint.style/rules
            ...pluginImport.flatConfigs.recommended.rules,
            ...pluginN.configs.recommended.rules,
            ...pluginUnicorn.configs['flat/recommended'].rules,

            "unicode-bom": ["error", "never"],

            "id-denylist": ["error", "DO_NOT_COMMIT", "DO_NOT_UNCOMMENT"],

            "no-console": "off",
            "no-shadow": "off",
            "no-var": [ "error" ],
            "prefer-const": [ "error" ],
            "semi": "error",
            "no-unused-vars": "error",

            "no-alert": ["error"],
            "no-debugger": ["error"],
            "no-template-curly-in-string": ["error"],

            "array-callback-return": ["error"],
            "no-constructor-return": ["error"],
            "no-sequences": ["error"],

            "require-await": "error",

            "no-throw-literal": "error",
            "prefer-promise-reject-errors": "error",

            // TODO: FIXME: Move these rules to `react.js` configuration file. In an attempt to do that, somehow it
            //              didn't get applied properly and lead to some indentation related ESLint errors.
            // https://www.npmjs.com/package/@stylistic/eslint-plugin-js
            // https://eslint.style/rules
            "@stylistic/jsx-curly-brace-presence": "off",
            "@stylistic/jsx-indent": ["error", 4],
            "@stylistic/jsx-indent-props": ["error", 4],
            "@stylistic/jsx-one-expression-per-line": "off",
            "@stylistic/jsx-tag-spacing": "off",
            "@stylistic/jsx-wrap-multilines": "off",

            // https://www.npmjs.com/package/@stylistic/eslint-plugin-js
            // https://eslint.style/rules
            "@stylistic/arrow-parens": ["error", "always"],
            "@stylistic/brace-style": "off",
            "@stylistic/comma-dangle": ["error", "never"],
            "@stylistic/comma-spacing": [
                "error",
                {
                    "before": false,
                    "after": true
                }
            ],
            "@stylistic/eol-last": ["error", "always"],
            "@stylistic/indent": [
                "error",
                4,
                {
                    "SwitchCase": 1, // https://eslint.style/rules/js/indent#switchcase
                    "ignoreComments": true // https://eslint.style/rules/js/indent#ignorecomments
                }
            ],
            "@stylistic/indent-binary-ops": ["error", 0],
            "@stylistic/key-spacing": "off",
            "@stylistic/keyword-spacing": ["error"],
            "@stylistic/linebreak-style": [ "error", "unix" ],
            "@stylistic/max-statements-per-line": "off",
            "@stylistic/no-multi-spaces": "off",
            "@stylistic/no-trailing-spaces": "error",
            "@stylistic/object-curly-spacing": ["error", "always"],
            "@stylistic/one-var-declaration-per-line": ["error", "always"],
            "@stylistic/operator-linebreak": ["error", "after"],
            // https://eslint.style/rules/js/quotes
            "@stylistic/quotes": [
                "warn",
                "single",
                {
                    "allowTemplateLiterals": true,
                    "avoidEscape": true
                }
            ],
            "@stylistic/semi": [ "error", "always" ],
            "@stylistic/semi-spacing": [
                "error",
                {
                    "before": false,
                    "after": true
                }
            ],
            "@stylistic/space-before-function-paren": [
                "error",
                {
                    "anonymous": "always",
                    "asyncArrow": "always",
                    "named": "never"
                }
            ],
            "@stylistic/space-in-parens": "off",

            // // TODO: Try to identify a well maintained package which can provide some of the rules provided by
            // // eslint-plugin-filenames (https://www.npmjs.com/package/eslint-plugin-filenames).
            // // Ref:
            // //     * No response at issue about asking for support: https://github.com/selaux/eslint-plugin-filenames/issues/54
            // //     * Can try switching to https://github.com/kavsingh/eslint-plugin-filenames/tree/eslint-9
            // //     * Can try if https://www.npmjs.com/package/eslint-plugin-project-structure helps
            // "filenames/match-exported": [
            //     "error",
            //     [
            //         null,
            //         "kebab"
            //     ]
            // ],
            // "filenames/no-index": [ "error" ],

            "import/no-unresolved": ["error", {
                "caseSensitive": true,
                "amd": true,
                "commonjs": true
            }],

            // https://github.com/benmosher/eslint-plugin-import/blob/HEAD/docs/rules/exports-last.md
            "import/exports-last": [ "error" ],

            // https://github.com/benmosher/eslint-plugin-import/blob/HEAD/docs/rules/no-default-export.md
            "import/no-default-export": [ "error" ],

            "n/hashbang": "off",
            "n/no-extraneous-import": "off",
            "n/no-extraneous-require": "off",
            "n/no-unpublished-import": "off",
            "n/no-unpublished-require": "off",

            "n/no-unsupported-features/es-syntax": ["error", {
                "version": ">=20",
            }],

            // TODO: Utilize this rule only inside Node.js environment
            "n/no-unsupported-features/node-builtins": "off",
            // "n/no-unsupported-features/node-builtins": ["error", {
            //     "version": ">=20",
            //     "ignores": []
            // }],

            // Rather than "n/no-missing-import", use "import/no-unresolved" / "import-x/no-unresolved"
            // Ref: https://github.com/eslint-community/eslint-plugin-n/issues/349#issuecomment-2393189937
            "n/no-missing-import": "off",

            "n/no-missing-require": [ "error" ],
            "n/no-deprecated-api": [ "error" ],

            // https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/callback-return.md
            "n/callback-return": [
                "error",
                [
                    "resolve",
                    "reject",

                    "next",
                    "res.status",
                    "res.end",
                    "res.send",

                    "callback",
                    "done"
                ]
            ],

            "unicorn/catch-error-name": "off",
            "unicorn/empty-brace-spaces": "off",
            "unicorn/explicit-length-check": "off",
            "unicorn/import-style": "off",
            "unicorn/no-array-push-push": "off",
            "unicorn/no-await-expression-member": "off",
            "unicorn/no-lonely-if": "off",
            "unicorn/no-negated-condition": "off",
            "unicorn/no-null": "off",
            "unicorn/no-process-exit": "off",
            "unicorn/no-this-assignment": "off",
            "unicorn/no-typeof-undefined": "off",
            "unicorn/no-useless-undefined": "off",
            "unicorn/numeric-separators-style": "off",
            "unicorn/prefer-global-this": "off",
            "unicorn/prefer-module": "off",
            "unicorn/prefer-node-protocol": "error",
            "unicorn/prefer-optional-catch-binding": "off",
            "unicorn/prefer-query-selector": "off",
            "unicorn/prefer-regexp-test": "off",
            "unicorn/prefer-switch": "off",
            "unicorn/prefer-spread": "off",
            "unicorn/prefer-ternary": "off",
            "unicorn/prefer-top-level-await": "off",
            "unicorn/prevent-abbreviations": "off",

            "unicorn/custom-error-definition": "error",
            "unicorn/error-message": "error",
            "unicorn/escape-case": "error",
            "unicorn/expiring-todo-comments": "error",
            "unicorn/filename-case": [
                "error",
                {
                    "cases": {
                        "camelCase": true,
                        "pascalCase": true,
                        "kebabCase": true
                    }
                }
            ],
            "unicorn/new-for-builtins": "error",
            "unicorn/no-abusive-eslint-disable": "error",
            "unicorn/no-instanceof-builtins": "error",
            "unicorn/no-console-spaces": "error",
            "unicorn/no-for-loop": "error",
            "unicorn/no-hex-escape": "error",
            "unicorn/no-new-buffer": "error",
            "unicorn/no-unreadable-array-destructuring": "error",
            "unicorn/no-unused-properties": "error",
            "unicorn/no-zero-fractions": "error",
            "unicorn/number-literal-case": "error",
            "unicorn/prefer-add-event-listener": "error",
            "unicorn/prefer-keyboard-event-key": "error",
            "unicorn/prefer-array-flat-map": "error",
            "unicorn/prefer-dom-node-text-content": "error",
            "unicorn/prefer-type-error": "error",
            "unicorn/regex-shorthand": "off",
            "unicorn/throw-new-error": "error",

            "unicorn/no-fn-reference-in-iterator": "off",
            "unicorn/consistent-function-scoping": "off"
        }
    }
];
