// const globals = require('globals');

import coreConfig from './_core.js';

const thisConfig = [
    ...coreConfig

    // {
    //     languageOptions: {
    //         globals: {
    //             ...globals.browser,
    //             ...globals.jest,
    //             ...globals.node
    //         }
    //     }
    // }
];

export default thisConfig;
