const coreConfig = require('./_core.js');

const thisConfig = structuredClone(coreConfig);

// NOTE: When using this config, set this in config manually
// thisConfig.parser = "@typescript-eslint/parser";

thisConfig.extends = [
    ...thisConfig.extends,
    "plugin:@typescript-eslint/recommended" // https://www.npmjs.com/package/@typescript-eslint/eslint-plugin
];

thisConfig.rules = {
    ...thisConfig.rules,

    // https://www.npmjs.com/package/@stylistic/eslint-plugin-js
    // https://eslint.style/rules
    "@stylistic/member-delimiter-style": [
        "error",
        {
            "singleline": { "delimiter": "semi", "requireLast": false },
            "multiline":  { "delimiter": "semi", "requireLast": false }
        }
    ],
    "@stylistic/type-annotation-spacing": ["error", { "before": false, "after": true }],

    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],

    "@typescript-eslint/no-var-requires": ["error"],

    "@typescript-eslint/no-this-alias": "off"
};

module.exports = thisConfig;
