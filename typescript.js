// NOTE: The "typescript-eslint" package is an optional peerDependency (npm doesn't auto-install it), hence this
//       repository also lists it under its own devDependencies (otherwise this import wouldn't resolve here)

import tseslint from 'typescript-eslint';

import { createNodeResolver } from 'eslint-plugin-import-x';

import coreConfig, { createJsxStylisticConfig } from './_core.js';

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
            // Prefixed upstream name (eg: "ironplate/typescript/typescript-eslint/recommended"), since this is
            // ironplate's modified copy (re-scoped "files")
            name: `ironplate/typescript/${config.name}`,
            files: typeScriptFileGlobs
        };
    }),

    {
        name: 'ironplate/typescript/rules',

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
            '@typescript-eslint/no-this-alias': 'off',

            // Import rules that are redundant (and expensive) for TypeScript files. All six rely on the "export
            // map" of "eslint-plugin-import-x": for every import, it resolves the target module, parses it and
            // records what it exports. That parsing makes them the slowest rules of this config (in one consumer
            // project, they alone took the uncached part of a full-repo lint run from ~7s to ~17s). For TypeScript
            // files, the cost buys nothing:
            //     * "import-x" builds export maps only for the extensions listed in its "import-x/extensions"
            //       setting, which defaults to .js, .mjs and .cjs. So in a TypeScript file, an import of another
            //       .ts/.tsx/.cts/.mts module is not checked at all, eg:
            //           import { notExported } from './utils.ts'; // Not reported by "import-x/named"
            //     * TypeScript reports these mistakes itself (and for .ts targets too):
            //           "import-x/named"     -> TS2614: Module './x' has no exported member 'y'
            //           "import-x/default"   -> TS1192: Module './x' has no default export
            //           "import-x/namespace" -> TS2339: Property 'y' does not exist on type 'typeof import(...)'
            //           "import-x/export"    -> TS2323 / TS2484: Cannot redeclare / conflicting exported names
            //       (eslint-plugin-import-x's own "typescript" config turns "import-x/named" off for this reason)
            //     * "no-named-as-default" and "no-named-as-default-member" have no TypeScript equivalent, but they
            //       are style hints rather than bug detectors (eg: prefer `import { Pool } from 'pg'` over
            //       `import pg from 'pg'; new pg.Pool()`), and they alone keep most of the export-map cost
            // Scoped to TypeScript files only: plain .js/.cjs/.mjs files keep these rules, since TypeScript checks
            // JavaScript files only when the project enables "checkJs". Projects that do enable it can turn these
            // rules off for their JavaScript files as well.
            'import-x/default': 'off',
            'import-x/export': 'off',
            'import-x/named': 'off',
            'import-x/namespace': 'off',
            'import-x/no-named-as-default': 'off',
            'import-x/no-named-as-default-member': 'off'
        }
    },

    // The TypeScript parser always parses JSX in .tsx files, so they get the JSX stylistic rules (with or without React)
    createJsxStylisticConfig({ name: 'ironplate/typescript/stylistic-jsx', files: ['**/*.tsx'] }),

    {
        name: 'ironplate/typescript/import-x',

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
        }
    }
];

const thisConfig = [
    ...coreConfig,
    ...typeScriptDelta
];

export { typeScriptDelta, typeScriptFileGlobs };
export default thisConfig;
