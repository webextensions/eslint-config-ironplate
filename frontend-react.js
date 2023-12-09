const coreConfig = require('./_core.js');

const thisConfig = JSON.parse(JSON.stringify(coreConfig));

thisConfig.env = {
    ...thisConfig.env,
    "browser": true
};

thisConfig.plugins = [
    ...thisConfig.plugins,
    "react",      // https://www.npmjs.com/package/eslint-plugin-react
    "react-hooks" // https://www.npmjs.com/package/eslint-plugin-react-hooks
];

thisConfig.extends = [
    ...thisConfig.extends,
    "plugin:react/recommended"
];

// http://eslint.org/docs/user-guide/migrating-to-2.0.0#language-options
thisConfig.parserOptions = {
    ...thisConfig.parserOptions,
    "ecmaFeatures": {
        "jsx": true
    }
};

thisConfig.settings = {
    ...thisConfig.settings,
    // https://github.com/yannickcr/eslint-plugin-react#configuration
    "react": {
        "version": "detect" // React version. "detect" automatically picks the version you have installed.
                            // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
                            // default to latest and warns if missing
                            // It will default to "detect" in the future
    }
};

thisConfig.rules = {
    ...thisConfig.rules,

    // https://www.npmjs.com/package/@stylistic/eslint-plugin-js
    // https://eslint.style/rules
    "@stylistic/jsx-indent": ["error", 4],
    "@stylistic/jsx-indent-props": ["error", 4],
    "@stylistic/jsx-one-expression-per-line": "off",
    "@stylistic/jsx-tag-spacing": "off",
    "@stylistic/jsx-wrap-multilines": "off",

    // https://github.com/yannickcr/eslint-plugin-react/blob/HEAD/docs/rules/self-closing-comp.md
    "react/self-closing-comp": [
        "error",
        {
            "component": true,
            "html": false
        }
    ],

    "react-hooks/rules-of-hooks": "error", // Checks rules of hooks
    "react-hooks/exhaustive-deps": "warn"  // Checks effect dependencies
};

module.exports = thisConfig;
