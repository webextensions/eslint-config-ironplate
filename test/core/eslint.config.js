import eslintIronplateConfig from 'eslint-config-ironplate';
import globals from 'globals';

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
