import reactConfig from './react.js';
import typeScriptConfig from './typescript.js';

const thisConfig = [
    ...reactConfig,
    ...typeScriptConfig,

    {
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

// NOTE: When using this config, set this in config manually
// thisConfig.parser = '@typescript-eslint/parser';

export default thisConfig;
