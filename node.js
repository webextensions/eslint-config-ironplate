// const globals = require('globals');

import coreConfig from './_core.js';

const thisConfig = [
    ...coreConfig,

    // {
    //     languageOptions: {
    //         globals: {
    //             ...globals.commonjs,
    //             ...globals.jest,
    //             ...globals.node
    //         }
    //     }
    // },

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
                        mjs: 'always'
                    }
                }
            ]
        }
    }
];

export default thisConfig;
