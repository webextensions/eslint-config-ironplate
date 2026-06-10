import globals from 'globals';

// NOTE: No "languageOptions.parser" wiring is needed for TypeScript files. The "eslint-config-ironplate" TypeScript
//       configs come bundled with the parser (via the "typescript-eslint" package).
import eslintIronplateConfigTypeScript from 'eslint-config-ironplate/typescript.js';

const config = [
    ...eslintIronplateConfigTypeScript,

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
