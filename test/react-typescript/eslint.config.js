import globals from 'globals';

// NOTE: No "languageOptions.parser" wiring is needed for TypeScript files. The "eslint-config-ironplate" TypeScript
//       configs come bundled with the parser (via the "typescript-eslint" package).
import eslintIronplateConfigReactTypeScript from 'eslint-config-ironplate/react-typescript.js';

const config = [
    ...eslintIronplateConfigReactTypeScript,

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
