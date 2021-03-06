const coreConfig = require('./_core.js');

const thisConfig = JSON.parse(JSON.stringify(coreConfig));

thisConfig.env = {
    ...thisConfig.env,
    "commonjs": true,
    "node": true
};

// NOTE: When using this config, set this in config manually
// thisConfig.parser = "@typescript-eslint/parser";

thisConfig.extends = [
    ...thisConfig.extends,
    "plugin:@typescript-eslint/recommended" // https://www.npmjs.com/package/@typescript-eslint/eslint-plugin
];

thisConfig.rules = {
    ...thisConfig.rules,

    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],

    "@typescript-eslint/no-var-requires": ["error"],

    "@typescript-eslint/no-this-alias": "off"
};

module.exports = thisConfig;
