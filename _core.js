// ESLint Shareable configs documentation:
//     https://eslint.org/docs/developer-guide/shareable-configs
//
// Note:
//     To list install peerDependencies:
//         $ npm info "eslint-config-ironplate" peerDependencies
//     To install peerDependencies:
//         $ npx install-peerdeps --dev eslint-config-ironplate
// Reference:
//     https://www.npmjs.com/package/eslint-config-airbnb/v/18.0.1

// TODO:
//     Create "eslint-config-ironplate/base.js" which doesn't use any plugins

const stylistic = require('@stylistic/eslint-plugin-js');

module.exports = {
    // http://eslint.org/docs/user-guide/configuring.html
    // https://gist.github.com/cletusw/e01a85e399ab563b1236
    "env": {
        "es2022": true // https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments
                       // This automatically sets the ecmaVersion parser option (parserOptions) to 12
    },

    "plugins": [
        "@stylistic/eslint-plugin-js",
        "eslint-plugin-import",      // https://www.npmjs.com/package/eslint-plugin-import
        "eslint-plugin-node",        // https://www.npmjs.com/package/eslint-plugin-node
        "eslint-plugin-unicorn",     // https://www.npmjs.com/package/eslint-plugin-unicorn
        "eslint-plugin-filenames"    // https://www.npmjs.com/package/eslint-plugin-filenames
    ],

    "extends": [
        "eslint:recommended",
        "plugin:@stylistic/recommended-extends",
        "plugin:eslint-plugin-import/errors",
        "plugin:eslint-plugin-import/warnings",
    ],

    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },

    "parserOptions": {
        // // Keeping `ecmaVersion: 2021` as commented out since this is automatically set when we say `env.es2021: true` (as can be seen above)
        // "ecmaVersion": 2021,
        // // Learn more: https://stackoverflow.com/questions/57378411/eslint-rule-for-optional-chaining-nullish-coalescing-operator/63239666#63239666

        "sourceType": "module" // https://github.com/AtomLinter/linter-eslint/issues/462#issuecomment-190770417
    },

    // https://eslint.org/docs/user-guide/configuring#adding-shared-settings
    "settings": {},

    "rules": {
        "unicode-bom": ["error", "never"],

        "no-console": "off",
        "no-shadow": "off",
        "no-var": [ "error" ],
        "prefer-const": [ "error" ],

        "no-alert": ["error"],
        "no-debugger": ["error"],
        "no-template-curly-in-string": ["error"],

        "array-callback-return": ["error"],
        "no-constructor-return": ["error"],
        "no-sequences": ["error"],

        // https://www.npmjs.com/package/@stylistic/eslint-plugin-js
        // https://eslint.style/rules
        "@stylistic/arrow-parens": ["error", "always"],
        "@stylistic/brace-style": "off",
        "@stylistic/comma-dangle": ["error", "never"],
        "@stylistic/comma-spacing": [
            "error",
            {
                "before": false,
                "after": true
            }
        ],
        "@stylistic/eol-last": ["error", "always"],
        "@stylistic/indent": [
            "error",
            4,
            {
                "SwitchCase": 1, // https://eslint.style/rules/js/indent#switchcase
                "ignoreComments": true // https://eslint.style/rules/js/indent#ignorecomments
            }
        ],
        "@stylistic/indent-binary-ops": ["error", 0],
        "@stylistic/key-spacing": "off",
        "@stylistic/keyword-spacing": ["error"],
        "@stylistic/linebreak-style": [ "error", "unix" ],
        "@stylistic/max-statements-per-line": "off",
        "@stylistic/no-multi-spaces": "off",
        "@stylistic/no-trailing-spaces": "error",
        "@stylistic/object-curly-spacing": ["error", "always"],
        "@stylistic/one-var-declaration-per-line": ["error", "always"],
        "@stylistic/operator-linebreak": ["error", "after"],
        // https://eslint.style/rules/js/quotes
        "@stylistic/quotes": [
            "warn",
            "single",
            {
                "allowTemplateLiterals": true,
                "avoidEscape": true
            }
        ],
        "@stylistic/semi": [ "error", "always" ],
        "@stylistic/semi-spacing": [
            "error",
            {
                "before": false,
                "after": true
            }
        ],
        "@stylistic/space-before-function-paren": [
            "error",
            {
                "anonymous": "always",
                "asyncArrow": "always",
                "named": "never"
            }
        ],
        "@stylistic/space-in-parens": "off",

        // https://www.npmjs.com/package/eslint-plugin-filenames
        "filenames/match-exported": [
            "error",
            [
                null,
                "kebab"
            ]
        ],
        "filenames/no-index": [ "error" ],

        // https://github.com/benmosher/eslint-plugin-import/blob/HEAD/docs/rules/exports-last.md
        "import/exports-last": [ "error" ],

        // https://github.com/benmosher/eslint-plugin-import/blob/HEAD/docs/rules/no-default-export.md
        "import/no-default-export": [ "error" ],

        /*
        // Commented out this rule since it doesn't have expected capabilities as of 2019-August
        // https://github.com/benmosher/eslint-plugin-import/blob/HEAD/docs/rules/extensions.md
        // Note:
        //     The requirement for compulsory extension seems to be well served by
        //     https://github.com/mysticatea/eslint-plugin-node/blob/HEAD/docs/rules/file-extension-in-import.md
        //     which is currently being used elsewhere in this file
        "import/extensions": [
            "error",
            "always",
            {
                "js": "ignorePackages"
            }
        ],
        /* */

        "node/no-missing-require": [ "error" ],
        "node/file-extension-in-import": [ "error" ],
        "node/no-deprecated-api": [ "error" ],

        // https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/callback-return.md
        "node/callback-return": [
            "error",
            [
                "callback",
                "done",
                "res.end",
                "res.send",
                "res.status",
                "next"
            ]
        ],

        "unicorn/custom-error-definition": "error",
        "unicorn/error-message": "error",
        "unicorn/escape-case": "error",
        "unicorn/expiring-todo-comments": "error",
        "unicorn/filename-case": [
            "error",
            {
                "cases": {
                    "camelCase": true,
                    "pascalCase": true,
                    "kebabCase": true
                }
            }
        ],
        "unicorn/new-for-builtins": "error",
        "unicorn/no-abusive-eslint-disable": "error",
        "unicorn/no-array-instanceof": "error",
        "unicorn/no-console-spaces": "error",
        "unicorn/no-for-loop": "error",
        "unicorn/no-hex-escape": "error",
        "unicorn/no-new-buffer": "error",
        "unicorn/no-process-exit": "error",
        "unicorn/no-unreadable-array-destructuring": "error",
        "unicorn/no-unsafe-regex": "error",
        "unicorn/no-unused-properties": "error",
        "unicorn/no-zero-fractions": "error",
        "unicorn/number-literal-case": "error",
        "unicorn/prefer-add-event-listener": "error",
        "unicorn/prefer-event-key": "error",
        "unicorn/prefer-flat-map": "error",
        "unicorn/prefer-text-content": "error",
        "unicorn/prefer-type-error": "error",
        "unicorn/regex-shorthand": "off",
        "unicorn/throw-new-error": "error",

        "unicorn/no-fn-reference-in-iterator": "off",
        "unicorn/consistent-function-scoping": "off"
    }
};
