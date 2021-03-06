const coreConfig = require('./_core.js');

const thisConfig = JSON.parse(JSON.stringify(coreConfig));

thisConfig.env = {
    ...thisConfig.env,
    "commonjs": true,
    "node": true
};

module.exports = thisConfig;
