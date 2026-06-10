import coreConfig from './_core.js';
import { reactDelta, reactFileGlobs } from './react.js';
import { typeScriptDelta, typeScriptFileGlobs } from './typescript.js';

const allFileGlobs = [...reactFileGlobs, ...typeScriptFileGlobs];

// Compose "core + deltas" so that the core config applies only once (spreading the full react.js and typescript.js
// configs would apply it twice, silently reverting the overrides in between).
const thisConfig = [
    ...coreConfig,

    // Re-scope the React delta to also cover the TypeScript extensions ("files" doesn't cascade in flat config, and
    // react.js itself must not list the TypeScript globs, or plain-React projects would lint TypeScript files
    // without a TypeScript parser)
    ...reactDelta.map(function (config) {
        return {
            ...config,
            files: allFileGlobs
        };
    }),

    ...typeScriptDelta,

    {
        rules: {
            // Union of the React and TypeScript deltas' "import-x/extensions" patterns (neither covers both the JSX
            // and the TypeScript extensions); must stay after both the deltas
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
                        jsx: 'always',
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

export default thisConfig;
