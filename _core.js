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

import eslintJs from '@eslint/js';

import pluginStylistic from '@stylistic/eslint-plugin';
import pluginImportX, { createNodeResolver, flatConfigs as pluginImportXFlatConfigs } from 'eslint-plugin-import-x';
import pluginN from 'eslint-plugin-n';
import pluginPromise from 'eslint-plugin-promise';
import pluginUnicorn from 'eslint-plugin-unicorn';

import { reactFileGlobs } from './_file-globs.js';

const isJsxStylisticRule = function (ruleId) {
    return ruleId.startsWith('@stylistic/jsx-');
};

const stylisticRecommendedRules = pluginStylistic.configs['recommended'].rules;
const stylisticRecommendedRulesWithoutJsx = Object.fromEntries(
    Object.entries(stylisticRecommendedRules).filter(([ruleId]) => !isJsxStylisticRule(ruleId))
);
const stylisticRecommendedJsxRules = Object.fromEntries(
    Object.entries(stylisticRecommendedRules).filter(([ruleId]) => isJsxStylisticRule(ruleId))
);

// Every config object carries a "name" ("ironplate/<module>/<topic>"), the standard flat-config label: it shows up in
// "npx @eslint/config-inspector" and in some ESLint error messages, and test/config-names.test.js uses it to catch a
// config object being applied twice (eg: by spreading two full presets, which would silently revert the overrides in
// between)
//
// The core config objects which don't depend on the selected features (node / react / typescript). The
// feature-dependent parts of the core config are computed by createCoreConfigs() below.
const coreConfigs = [
    {
        name: 'ironplate/core/base',

        plugins: {
        },

        // Equivalent of the "--report-unused-disable-directives" CLI flag
        // https://eslint.org/docs/latest/use/configure/configuration-files#reporting-unused-disable-directives
        linterOptions: {
            reportUnusedDisableDirectives: 'error'
        },

        // languageOptions: {
        //     globals: {
        //         Atomics: 'readonly',
        //         SharedArrayBuffer: 'readonly'
        //     }
        // },

        // https://eslint.org/docs/latest/use/configure/configuration-files#configuring-shared-settings
        settings: {
        },

        rules: {
            ...eslintJs.configs.recommended.rules,

            'array-callback-return': ['error'],
            'eqeqeq': 'error',
            'id-denylist': ['error', 'DO_NOT_COMMIT', 'DO_NOT_UNCOMMENT'],
            'no-alert': ['error'],
            'no-bitwise': 'error',
            'no-console': 'off',
            'no-constructor-return': ['error'],
            'no-debugger': ['error'],
            'no-promise-executor-return': 'error',
            'no-sequences': ['error'],
            'no-shadow': 'off',
            'no-template-curly-in-string': ['error'],
            'no-throw-literal': 'error',
            'no-unassigned-vars': 'error',
            'no-unused-vars': 'error',
            'no-use-before-define': ['error', { functions: false, classes: true }],
            'no-var': ['error'],
            'prefer-const': ['error'],
            'prefer-promise-reject-errors': 'error',
            'prefer-regex-literals': 'error',
            'preserve-caught-error': 'error',
            'require-await': 'error',
            'unicode-bom': ['error', 'never']

            // // TODO: Try to identify a well maintained package which can provide some of the rules provided by
            // // eslint-plugin-filenames (https://www.npmjs.com/package/eslint-plugin-filenames).
            // // Ref:
            // //     * No response at issue about asking for support: https://github.com/selaux/eslint-plugin-filenames/issues/54
            // //     * Can try switching to https://github.com/kavsingh/eslint-plugin-filenames/tree/eslint-9
            // //     * Can try if https://www.npmjs.com/package/eslint-plugin-project-structure helps
            // 'filenames/match-exported': [
            //     'error',
            //     [
            //         null,
            //         'kebab'
            //     ]
            // ],
            // 'filenames/no-index': [ 'error' ]
        }
    },

    {
        name: 'ironplate/core/stylistic',

        plugins: {
            '@stylistic': pluginStylistic
        },

        rules: {
            // https://eslint.style/rules
            // The "@stylistic/jsx-*" rules of the recommended set live in the "ironplate/core/stylistic-jsx" config
            // object instead (see createJsxStylisticConfigs() below), which applies only to the files that can
            // contain JSX
            ...stylisticRecommendedRulesWithoutJsx,

            // https://www.npmjs.com/package/@stylistic/eslint-plugin-js
            // https://eslint.style/rules
            '@stylistic/arrow-parens': ['error', 'always'],
            '@stylistic/brace-style': 'off',
            '@stylistic/comma-dangle': ['error', 'never'],
            '@stylistic/comma-spacing': [
                'error',
                {
                    before: false,
                    after: true
                }
            ],
            '@stylistic/eol-last': ['error', 'always'],
            '@stylistic/function-call-argument-newline': ['error', 'consistent'],
            '@stylistic/function-paren-newline': ['error', 'consistent'],
            '@stylistic/implicit-arrow-linebreak': ['error', 'beside'],
            '@stylistic/indent': [
                'error',
                4,
                {
                    SwitchCase: 1, // https://eslint.style/rules/js/indent#switchcase
                    ignoreComments: true // https://eslint.style/rules/js/indent#ignorecomments
                }
            ],
            '@stylistic/indent-binary-ops': ['error', 0],
            '@stylistic/key-spacing': 'off',
            '@stylistic/keyword-spacing': ['error'],
            '@stylistic/linebreak-style': ['error', 'unix'],
            // https://eslint.style/rules/list-style
            // Enabled with its defaults by the recommended set above; limited here to braces, where it replaces the
            // deprecated "object-curly-newline" and "object-curly-spacing":
            //     * Arrays ("[]") stay free-form, so that grouped multi-item lines (e.g. lookup tables) are allowed
            //     * Calls / parameters ("()") stay with the deprecated "function-call-argument-newline" and
            //       "function-paren-newline": list-style's auto-fix in @stylistic 6.0.1 deletes the "(" of a
            //       parenthesized multi-line argument but keeps its ")", e.g. `fn('a', (\n    <div />\n));`
            '@stylistic/list-style': [
                'error',
                {
                    overrides: {
                        '()': 'off',
                        '<>': 'off',
                        '[]': 'off',
                        '{}': { singleLine: { spacing: 'always' } },
                        'IfStatement': 'off'
                    }
                }
            ],
            '@stylistic/max-statements-per-line': 'off',
            '@stylistic/no-extra-semi': 'error',
            '@stylistic/no-mixed-operators': ['error', { allowSamePrecedence: false }],

            // '@stylistic/no-multi-spaces': [
            //     'error',
            //     {
            //         'ignoreEOLComments': true,
            //         'exceptions': {
            //             // 'BinaryExpression': true,
            //             'Property': true,
            //             'VariableDeclarator': true
            //         }
            //     }
            // ],
            '@stylistic/no-multi-spaces': 'off',

            '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 1 }],
            '@stylistic/no-trailing-spaces': 'error',
            '@stylistic/one-var-declaration-per-line': ['error', 'always'],
            '@stylistic/operator-linebreak': ['error', 'after'],
            '@stylistic/quote-props': [
                'error',
                'consistent-as-needed',
                {
                    numbers: true
                }
            ],
            // https://eslint.style/rules/js/quotes
            '@stylistic/quotes': [
                'warn',
                'single',
                {
                    allowTemplateLiterals: 'avoidEscape',
                    avoidEscape: true
                }
            ],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/semi-spacing': [
                'error',
                {
                    before: false,
                    after: true
                }
            ],
            '@stylistic/space-before-function-paren': [
                'error',
                {
                    anonymous: 'always',
                    asyncArrow: 'always',
                    named: 'never'
                }
            ],
            '@stylistic/space-in-parens': 'off',
            '@stylistic/spaced-comment': [
                'error',
                'always',
                {
                    line: {
                        exceptions: ['/']
                    },
                    block: {
                        markers: ['!'],
                        exceptions: ['*'],
                        balanced: true
                    }
                }
            ]
        }
    },

    {
        name: 'ironplate/core/import-x',

        plugins: {
            'import-x': pluginImportX
        },
        // The "import-x/resolver-next" setting depends on the selected features, see createImportXResolutionConfig()
        // below
        rules: {
            ...pluginImportXFlatConfigs.recommended.rules,

            'import-x/no-unresolved': ['error', {
                caseSensitive: true,
                amd: true,
                commonjs: true
            }],

            // https://github.com/un-ts/eslint-plugin-import-x/blob/HEAD/docs/rules/exports-last.md
            'import-x/exports-last': ['error'],

            // Imports of local files must include the file extension (eg: `import { x } from './utils.js';`), as
            // required by ES modules (and by TypeScript's "nodenext" module resolution), for type-only imports too.
            // Packages are exempt (eg: `import express from 'express';`), and so are imports of non-code files which
            // already carry their extension (eg: './styles.module.css'). This "always" form behaves like an explicit
            // "never" + per-extension "always" pattern for all real imports, but it is the same for every preset, and
            // other linters (eg: Oxlint) interpret it the same way.
            // https://github.com/un-ts/eslint-plugin-import-x/blob/HEAD/docs/rules/extensions.md
            'import-x/extensions': ['error', 'always', {
                ignorePackages: true,
                checkTypeImports: true
            }],

            // https://github.com/un-ts/eslint-plugin-import-x/blob/HEAD/docs/rules/no-default-export.md
            'import-x/no-default-export': ['error']
        }
    },

    {
        name: 'ironplate/core/n',

        plugins: {
            n: pluginN
        },
        rules: {
            // The Node.js-environment "n/" rules (including the "flat/recommended" spread) live in _node.js; only the
            // generically-relevant rules are kept here

            // https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/callback-return.md
            'n/callback-return': [
                'error',
                [
                    'resolve',
                    'reject',

                    'next',
                    'res.status',
                    'res.end',
                    'res.send',

                    'callback',
                    'done'
                ]
            ],

            'n/no-exports-assign': 'error',
            'n/no-missing-require': ['error']

            // The "n/no-unsupported-features/*" rules check the code against a Node.js version, so they are part of the
            // "node" feature (_node.js) only (eg: they would be meaningless for the browser code of the React configs)
        }
    },

    {
        name: 'ironplate/core/promise',

        plugins: {
            promise: pluginPromise
        },
        rules: {
            ...pluginPromise.configs['flat/recommended'].rules
        }
    },

    {
        name: 'ironplate/core/unicorn',

        plugins: {
            unicorn: pluginUnicorn
        },
        rules: {
            ...pluginUnicorn.configs.recommended.rules,

            'unicorn/catch-error-name': 'off',
            'unicorn/consistent-function-scoping': 'off',
            'unicorn/custom-error-definition': 'error',
            'unicorn/empty-brace-spaces': 'off',
            'unicorn/error-message': 'error',
            'unicorn/escape-case': 'error',
            'unicorn/expiring-todo-comments': 'error',
            'unicorn/explicit-length-check': 'off',
            'unicorn/filename-case': [
                'error',
                {
                    cases: {
                        camelCase: true,
                        pascalCase: true,
                        kebabCase: true
                    }
                }
            ],
            'unicorn/import-style': 'off',
            // Allows short / abbreviated names (eg: `err`, `props`, `i`)
            'unicorn/name-replacements': 'off',
            'unicorn/new-for-builtins': 'error',
            'unicorn/no-abusive-eslint-disable': 'error',
            'unicorn/no-array-reverse': 'off',
            'unicorn/no-await-expression-member': 'off',
            'unicorn/no-console-spaces': 'error',
            'unicorn/no-for-loop': 'error',
            'unicorn/no-immediate-mutation': 'off',
            'unicorn/no-instanceof-builtins': 'error',
            'unicorn/no-lonely-if': 'off',
            'unicorn/no-negated-condition': 'off',
            'unicorn/no-new-buffer': 'error',
            'unicorn/no-null': 'off',
            'unicorn/no-process-exit': 'off',
            'unicorn/no-this-assignment': 'off',
            'unicorn/no-typeof-undefined': 'off',
            'unicorn/no-unreadable-array-destructuring': 'error',
            'unicorn/no-unused-properties': 'error',
            'unicorn/no-useless-undefined': 'off',
            'unicorn/no-zero-fractions': 'error',
            'unicorn/number-literal-case': 'error',
            'unicorn/numeric-separators-style': 'off',
            'unicorn/prefer-add-event-listener': 'error',
            'unicorn/prefer-array-flat-map': 'error',
            'unicorn/prefer-dom-node-text-content': 'error',
            'unicorn/prefer-global-this': 'off',
            'unicorn/prefer-keyboard-event-key': 'error',
            'unicorn/prefer-module': 'off',
            'unicorn/prefer-node-protocol': 'error',
            'unicorn/prefer-optional-catch-binding': 'off',
            'unicorn/prefer-query-selector': 'off',
            'unicorn/prefer-regexp-test': 'off',
            'unicorn/prefer-single-call': 'off',
            'unicorn/prefer-spread': 'off',
            'unicorn/prefer-switch': 'off',
            'unicorn/prefer-ternary': 'off',
            'unicorn/prefer-top-level-await': 'off',
            'unicorn/prefer-type-error': 'error',
            'unicorn/throw-new-error': 'error'
        }
    }
];

// The module resolution of "import-x", decided once from the selected features (instead of each feature overriding
// the previous value, which made the result depend on the order of the config objects)
const createImportXResolutionConfig = function ({ typescript }) {
    return {
        name: 'ironplate/core/import-x-resolution',

        settings: {
            // "eslint-plugin-import-x" doesn't ship the legacy "node" resolver, so without this setting, its rules
            // fail with "Resolve error: node with invalid interface loaded as resolver"
            // https://github.com/un-ts/eslint-plugin-import-x#import-xresolver-next
            'import-x/resolver-next': [
                (
                    typescript ?
                        createNodeResolver({
                            extensions: ['.cts', '.mts', '.ts', '.tsx', '.cjs', '.js', '.jsx', '.mjs']
                        }) :
                        createNodeResolver()
                )
            ]
        }
    };
};

// The "@stylistic/jsx-*" rules, applied only to the files that can contain JSX: the React files (when the "react"
// feature is selected) and the .tsx files (when the "typescript" feature is selected, since the TypeScript parser
// always parses JSX in .tsx files). Kept in "core" (rather than in _react.js), because "@stylistic/eslint-plugin" is a
// required peerDependency, while the React plugins are optional.
const createJsxStylisticConfigs = function ({ react, typescript }) {
    const files = [
        ...(react ? reactFileGlobs : []),
        ...(typescript ? ['**/*.tsx'] : [])
    ];
    if (files.length === 0) {
        return [];
    }

    return [
        {
            name: 'ironplate/core/stylistic-jsx',

            files,

            rules: {
                ...stylisticRecommendedJsxRules,

                // https://eslint.style/rules
                '@stylistic/jsx-curly-brace-presence': 'off',
                '@stylistic/jsx-indent-props': ['error', 4],
                '@stylistic/jsx-one-expression-per-line': 'off',
                '@stylistic/jsx-tag-spacing': 'off',
                '@stylistic/jsx-wrap-multilines': 'off'
            }
        }
    ];
};

// The complete core part of the config for the given features
const createCoreConfigs = function ({ react, typescript }) {
    return [
        ...coreConfigs,
        createImportXResolutionConfig({ typescript }),
        ...createJsxStylisticConfigs({ react, typescript })
    ];
};

export { coreConfigs, createCoreConfigs };
