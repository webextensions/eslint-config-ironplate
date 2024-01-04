const coreConfig = require('./typescript.js');

const thisConfig = structuredClone(coreConfig);

// NOTE: When using this config, set this in config manually
// thisConfig.parser = "@typescript-eslint/parser";

thisConfig.env = {
    ...thisConfig.env,
    "commonjs": true,
    "node": true
};

module.exports = thisConfig;
