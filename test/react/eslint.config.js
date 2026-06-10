import globals from 'globals';

import eslintIronplateConfigReact from 'eslint-config-ironplate/react.js';

const config = [
    ...eslintIronplateConfigReact,

    {
        ignores: [
            'eslint.config.js'
        ]
    },

    {
        languageOptions: {
            globals: {
                ...globals.browser
            }
        }
    }
];

export default config;
