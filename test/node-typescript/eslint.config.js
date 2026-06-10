import globals from 'globals';

// NOTE: No "languageOptions.parser" wiring is needed for TypeScript files. The "eslint-config-ironplate" TypeScript
//       configs come bundled with the parser (via the "typescript-eslint" package).
import eslintIronplateConfigNodeTypeScript from 'eslint-config-ironplate/node-typescript.js';

const config = [
    ...eslintIronplateConfigNodeTypeScript,

    {
        ignores: [
            'eslint.config.js'
        ]
    },

    {
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    }
];

export default config;
