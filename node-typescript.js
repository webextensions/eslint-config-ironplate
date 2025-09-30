import nodeConfig from './node.js';
import typeScriptConfig from './typescript.js';

const thisConfig = [
    ...nodeConfig,
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
                        js: 'always',
                        json: 'always',
                        mjs: 'always',
                        ts: 'always'
                    }
                }
            ]
        }
    }
];

export default thisConfig;
