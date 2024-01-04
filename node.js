const coreConfig = require('./_core.js');

const thisConfig = structuredClone(coreConfig);

thisConfig.env = {
    ...thisConfig.env,
    "commonjs": true,
    "node": true
};

module.exports = thisConfig;
