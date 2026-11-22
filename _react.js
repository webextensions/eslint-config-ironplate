// NOTE: The react-family packages are optional peerDependencies (npm doesn't auto-install them), hence this
//       repository also lists them under its own devDependencies (otherwise these imports wouldn't resolve here)

import { createRequire } from 'node:module';
import path from 'node:path';

import pluginEslintReact from '@eslint-react/eslint-plugin';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';

import {
    reactFileGlobs,
    typeScriptFileGlobs
} from './_file-globs.js';

// The installed React version, for the "react-x.version" setting of @eslint-react. Its recommended config sets
// 'detect', which makes the rules read the installed "react" package while linting - an input from outside the linted
// file, so `eslint --cache` could return stale results after a React upgrade (see _cache-unsafe-rules.js). Resolving
// it here, the same way @eslint-react resolves 'detect' (`require('react').version` from the current working
// directory), puts the value into the resolved config, which the cache does key on. Falls back to 'detect' when
// "react" doesn't resolve.
const resolveReactVersion = function () {
    try {
        const { version } = createRequire(process.cwd() + path.sep)('react');
        return typeof version === 'string' ? version : 'detect';
    } catch {
        return 'detect';
    }
};

// The React-specific config objects (the "react" feature of createIronplateConfig()). Their "files" get extended to
// the TypeScript extensions by createReactConfigs() when the "typescript" feature is also selected.
const reactConfigs = [
    {
        name: 'ironplate/react/base',

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
        name: 'ironplate/react/react-hooks',
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
        name: 'ironplate/react/react-refresh',
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
        // Prefixed upstream name (it must stay after the spread): this object is ironplate's modified copy of
        // "@eslint-react/recommended" (re-scoped "files" and the rule overrides below)
        name: `ironplate/react/${pluginEslintReact.configs.recommended.name}`,
        files: reactFileGlobs, // must stay after the spread (so the recommended config can't clobber it)
        settings: {
            ...pluginEslintReact.configs.recommended.settings,
            'react-x': {
                ...pluginEslintReact.configs.recommended.settings?.['react-x'],
                version: resolveReactVersion()
            }
        },
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

const createReactConfigs = function ({ typescript }) {
    if (!typescript) {
        return reactConfigs;
    }

    // With TypeScript, the React config objects also cover the TypeScript extensions ("files" doesn't cascade in flat
    // config, so each object gets the combined globs)
    return reactConfigs.map(function (config) {
        return {
            ...config,
            files: [...reactFileGlobs, ...typeScriptFileGlobs]
        };
    });
};

export { createReactConfigs };
