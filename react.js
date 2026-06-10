// NOTE: The react-family packages are optional peerDependencies (npm doesn't auto-install them), hence this
//       repository also lists them under its own devDependencies (otherwise these imports wouldn't resolve here)

import pluginEslintReact from '@eslint-react/eslint-plugin';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';

import coreConfig from './_core.js';

const reactFileGlobs = [
    '**/*.cjs',
    '**/*.js',
    '**/*.jsx',
    '**/*.mjs'
];

// The React-specific additions on top of the core config (exported for composite configs, eg: react-typescript.js)
const reactDelta = [
    {
        files: reactFileGlobs,

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

        rules: {
            'import-x/extensions': [
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

            // https://eslint.style/rules/jsx-self-closing-comp
            '@stylistic/jsx-self-closing-comp': [
                'error',
                {
                    component: true,
                    html: false
                }
            ]
        }
    },

    {
        files: reactFileGlobs,
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
        files: reactFileGlobs,
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
        files: reactFileGlobs, // must stay after the spread (so the recommended config can't clobber it)
        rules: {
            ...pluginEslintReact.configs.recommended.rules,

            // "@eslint-react/eslint-plugin" v5 ships its own ported copies of several "eslint-plugin-react-hooks"
            // rules in its recommended config. Keeping "eslint-plugin-react-hooks" authoritative for those, hence
            // turning the ported copies off (to avoid duplicate diagnostics).
            '@eslint-react/error-boundaries': 'off',
            '@eslint-react/exhaustive-deps': 'off',
            '@eslint-react/purity': 'off',
            '@eslint-react/rules-of-hooks': 'off',
            '@eslint-react/set-state-in-effect': 'off',
            '@eslint-react/set-state-in-render': 'off',
            '@eslint-react/static-components': 'off',
            '@eslint-react/unsupported-syntax': 'off',
            '@eslint-react/use-memo': 'off'
        }
    }
];

const thisConfig = [
    ...coreConfig,
    ...reactDelta
];

export { reactDelta, reactFileGlobs };
export default thisConfig;
