// const globals = require('globals');

const coreConfig = require('./_core.js');

let thisConfig = coreConfig;

thisConfig = [
    ...thisConfig,

    {
        // languageOptions: {
        //     globals: {
        //         ...globals.commonjs,
        //         ...globals.jest,
        //         ...globals.node
        //     }
        // }
    },

    {
        rules: {
            'import/extensions': [
                'error',
                'never',
                {
                    ignorePackages: true,
                    pattern: {
                        'cjs': 'always',
                        'js': 'always',
                        'json': 'always',
                        'mjs': 'always'
                    }
                }
            ]
        }
    }
];

module.exports = [...thisConfig];
