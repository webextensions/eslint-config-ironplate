import globals from 'globals';

import eslintIronplateConfig from 'eslint-config-ironplate';

const config = [
    ...eslintIronplateConfig,

    {
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    }
];

// eslint-disable-next-line import-x/no-default-export
export default config;
