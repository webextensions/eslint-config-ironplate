const coreConfig = require('./_core.js');

const thisConfig = structuredClone(coreConfig);

thisConfig.env = {
    ...thisConfig.env,
    "browser": true,
    "commonjs": true,
    "node": true
};

module.exports = thisConfig;
