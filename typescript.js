const coreConfig = require('./_core.js');

const thisConfig = structuredClone(coreConfig);

// NOTE: When using this config, set this in config manually
// thisConfig.parser = "@typescript-eslint/parser";

thisConfig.extends = [
    // NOTE: Applying "plugin:@typescript-eslint/recommended" first and then applying `...thisConfig.extends` because
    //       otherwise, if specified later, at the time of writing this note (with @typescript-eslint/eslint-plugin@8.8.1),
    //       various linting rules were disabled to avoid duplicate warnings/errors which TypeScript also catches
    //       (https://github.com/typescript-eslint/typescript-eslint/issues/2477#issuecomment-686892459) which leads to
    //       some rules not being applied, eg: 'no-undef', 'no-dupe-keys' etc.
    //       Ref: https://github.com/typescript-eslint/typescript-eslint/blob/v8.8.1/packages/eslint-plugin/src/configs/eslint-recommended-raw.ts#L38
    "plugin:@typescript-eslint/recommended", // https://www.npmjs.com/package/@typescript-eslint/eslint-plugin

    ...thisConfig.extends
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
