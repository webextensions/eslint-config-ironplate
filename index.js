const globals = require('globals');

const coreConfig = require('./_core.js');

let thisConfig = coreConfig;

thisConfig = [
    ...thisConfig,

    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jest,
                ...globals.node
            }
        }
    }
];

module.exports = [...thisConfig];
