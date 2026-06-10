// NOTE: The "typescript-eslint" package is an optional peerDependency (npm doesn't auto-install it), hence this
//       repository also lists it under its own devDependencies (otherwise this import wouldn't resolve here)

import tseslint from 'typescript-eslint';

import { createNodeResolver } from 'eslint-plugin-import-x';

import coreConfig from './_core.js';

// TODO: Also look into https://www.npmjs.com/package/eslint-import-resolver-typescript if that can be helpful in some cases

const typeScriptFileGlobs = ['**/*.cts', '**/*.mts', '**/*.ts', '**/*.tsx'];

// The TypeScript-specific additions on top of the core config (exported for composite configs, eg:
// node-typescript.js and react-typescript.js)
const typeScriptDelta = [
    // The "typescript-eslint" recommended configs come bundled with the parser ("typescript-eslint/base"), hence
    // consumers don't need to set up "languageOptions.parser" themselves.
    // https://typescript-eslint.io/users/configs/#recommended
    ...tseslint.configs.recommended.map(function (config) {
        return {
            ...config,
            files: typeScriptFileGlobs
        };
    }),

    {
        files: typeScriptFileGlobs,

        rules: {
            // https://www.npmjs.com/package/@stylistic/eslint-plugin-js
            // https://eslint.style/rules
            '@stylistic/member-delimiter-style': [
                'error',
                {
                    singleline: { delimiter: 'semi', requireLast: false },
                    multiline:  { delimiter: 'semi', requireLast: false }
                }
            ],
            '@stylistic/type-annotation-spacing': [
                'error',
                {
                    before: true,
                    after: true,
                    overrides: {
                        colon: {
                            before: false,
                            after: true
                        }
                    }
                }
            ],

            // Turning it off from Linting since it is handled by TypeScript
            // If we keep it on, then there can be cases where `type` defintions (eg: `VoidFunction`) can cause false positives
            'no-undef': 'off',

            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error'],

            'no-use-before-define': 'off',
            '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: true }],

            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-this-alias': 'off'
        }
    },

    {
        settings: {
            // https://github.com/un-ts/eslint-plugin-import-x#import-xresolver-next
            'import-x/resolver-next': [
                createNodeResolver({
                    extensions: (function () {
                        const typeScriptExtensions = ['.cts', '.mts', '.ts', '.tsx'];
                        const allExtensions = [...typeScriptExtensions, '.cjs', '.js', '.jsx', '.mjs'];

                        return allExtensions;
                    })()
                })
            ]
        },

        rules: {
            'import-x/extensions': [
                'error',
                'never',
                {
                    ignorePackages: true,
                    pattern: {
                        cjs: 'always',
                        cts: 'always',
                        js: 'always',
                        json: 'always',
                        mjs: 'always',
                        mts: 'always',
                        ts: 'always',
                        tsx: 'always'
                    }
                }
            ]
        }
    }
];

const thisConfig = [
    ...coreConfig,
    ...typeScriptDelta
];

export { typeScriptDelta, typeScriptFileGlobs };
export default thisConfig;
