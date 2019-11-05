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
//     Create "eslint-config-ironplate-base" which doesn't use any plugins

module.exports = {
    // http://eslint.org/docs/user-guide/configuring.html
    // https://gist.github.com/cletusw/e01a85e399ab563b1236
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:import/errors",
        "plugin:import/warnings"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        // http://eslint.org/docs/user-guide/migrating-to-2.0.0#language-options
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module" // https://github.com/AtomLinter/linter-eslint/issues/462#issuecomment-190770417
    },
    "plugins": [
        "filenames",   // https://www.npmjs.com/package/eslint-plugin-filenames
        "import",      // https://www.npmjs.com/package/eslint-plugin-import
        "node",
        "react",       // https://www.npmjs.com/package/eslint-plugin-react
        "react-hooks", // https://www.npmjs.com/package/eslint-plugin-react-hooks
        "unicorn"      // https://www.npmjs.com/package/eslint-plugin-unicorn
    ],
    "rules": {
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1, // https://eslint.org/docs/rules/indent#switchcase
                "ignoreComments": true // https://eslint.org/docs/rules/indent#ignorecomments
            }
        ],
        "linebreak-style": [ "error", "unix" ],

        // http://eslint.org/docs/rules/quotes
        "quotes": [
            "warn",
            "single",
            {
                "allowTemplateLiterals": true,
                "avoidEscape": true
            }
        ],

        "semi": [ "error", "always" ],
        "no-console": "off",
        "no-shadow": "off",
        "no-var": [ "error" ],
        "prefer-const": [ "error" ],
        "comma-dangle": ["error", "never"],
        "space-before-function-paren": [
            "error",
            {
                "anonymous": "always",
                "asyncArrow": "always",
                "named": "never"
            }
        ],

        "no-debugger": ["error"],
        "no-template-curly-in-string": ["error"],
        "one-var-declaration-per-line": ["error", "always"]

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

        // https://github.com/yannickcr/eslint-plugin-react/blob/HEAD/docs/rules/self-closing-comp.md
        "react/self-closing-comp": [
            "error",
            {
                "component": true,
                "html": false
            }
        ],

        "react-hooks/rules-of-hooks": "error", // Checks rules of hooks
        "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies

        "node/no-missing-require": [ "error" ],
        "node/file-extension-in-import": [ "error" ],
        "node/no-deprecated-api": [ "error" ],

        "unicorn/consistent-function-scoping": "error",
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
        "unicorn/no-fn-reference-in-iterator": "error",
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
        "unicorn/regex-shorthand": "error",
        "unicorn/throw-new-error": "error"
    },
    // https://eslint.org/docs/user-guide/configuring#adding-shared-settings
    "settings": {
        // https://github.com/yannickcr/eslint-plugin-react#configuration
        "react": {
            "version": "detect" // React version. "detect" automatically picks the version you have installed.
                                // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
                                // default to latest and warns if missing
                                // It will default to "detect" in the future
        }
    }
};
