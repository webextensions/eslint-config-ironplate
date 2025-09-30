import coreConfig from './_core.js';

// // NOTE: When using this config, set this in config manually
// import parser from '@typescript-eslint/parser';
// // and utilize it in the config as:
// const config = {
//     languageOptions: {
//         parser
//     }
// }

// https://github.com/import-js/eslint-plugin-import/issues/2331#issuecomment-997417550
import pluginTypescript from '@typescript-eslint/eslint-plugin'; // eslint-disable-line import/no-unresolved

// NOTE: Also look into https://www.npmjs.com/package/eslint-import-resolver-typescript if that can be helpful in some cases

// NOTE:
//     https://github.com/import-js/eslint-plugin-import/issues/2556#issuecomment-1663038247
//     https://github.com/import-js/eslint-plugin-import/pull/2829 (Pending as of 2024-Oct)
//     For now, we may have to ignore liniting issue in `eslint.config.js` for `const parser = require('@typescript-eslint/parser');`

const thisConfig = [
    ...coreConfig,

    {
        plugins: {
            '@typescript-eslint': pluginTypescript
        },

        // TODO: Verify the validity/utility of the following note in the context of new flat config system
        // NOTE: In old config system, we were applying "plugin:@typescript-eslint/recommended" first and then applying
        //       `...thisConfig.extends` because otherwise, if specified later, at the time of writing that note (with
        //       @typescript-eslint/eslint-plugin@8.8.1), various linting rules were disabled to avoid duplicate
        //       warnings/errors which TypeScript also catches (https://github.com/typescript-eslint/typescript-eslint/issues/2477#issuecomment-686892459)
        //       which leads to some rules not being applied, eg: 'no-undef', 'no-dupe-keys' etc.
        //       Ref: https://github.com/typescript-eslint/typescript-eslint/blob/v8.8.1/packages/eslint-plugin/src/configs/eslint-recommended-raw.ts#L38

        rules: {
            ...pluginTypescript.configs.recommended.rules, // https://typescript-eslint.io/users/configs/#recommended

            // https://www.npmjs.com/package/@stylistic/eslint-plugin-js
            // https://eslint.style/rules
            '@stylistic/member-delimiter-style': [
                'error',
                {
                    singleline: { delimiter: 'semi', requireLast: false },
                    multiline:  { delimiter: 'semi', requireLast: false }
                }
            ],
            '@stylistic/type-annotation-spacing': ['error', { before: false, after: true }],

            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error'],

            'no-use-before-define': 'off',
            '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: true }],

            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-this-alias': 'off',
            '@typescript-eslint/no-var-requires': ['off']
        }
    },

    {
        settings: {
            'import/resolver': {
                node: {
                    // https://github.com/import-js/eslint-plugin-import/blob/67cc79841fc823ad4af2532af2dc6704e4b3b03a/config/typescript.js
                    extensions: (function () {
                        const typeScriptExtensions = ['.cts', '.mts', '.ts', '.tsx'];
                        const allExtensions = [...typeScriptExtensions, '.cjs', '.js', '.jsx', '.mjs'];

                        return allExtensions;
                    })()
                }
            }
        },

        rules: {
            'import/extensions': [
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
                        ts: 'always'
                    }
                }
            ]
        }
    }
];

export default thisConfig;
