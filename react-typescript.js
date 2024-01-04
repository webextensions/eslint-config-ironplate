const reactConfig = require('./react.js');
const typeScriptConfig = require('./typescript.js');

const thisConfig = structuredClone(typeScriptConfig);

// NOTE: When using this config, set this in config manually
// thisConfig.parser = "@typescript-eslint/parser";

thisConfig.env = {
    ...thisConfig.env,
    ...reactConfig.env
};

thisConfig.plugins = [
    ...thisConfig.plugins,
    ...reactConfig.plugins
];

thisConfig.extends = [
    ...thisConfig.extends,
    ...reactConfig.extends
];

thisConfig.parserOptions = {
    ...thisConfig.parserOptions,
    ...reactConfig.parserOptions
};

thisConfig.settings = {
    ...thisConfig.settings,
    ...reactConfig.settings
};

thisConfig.rules = {
    ...thisConfig.rules,
    ...reactConfig.rules
};

module.exports = thisConfig;
