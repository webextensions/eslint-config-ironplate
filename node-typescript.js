const nodeConfig = require('./node.js');
const typeScriptConfig = require('./typescript.js');

const thisConfig = [
    ...nodeConfig,
    ...typeScriptConfig,

    {
        rules: {
            "import/extensions": [
                "error",
                "never",
                {
                    ignorePackages: true,
                    pattern: {
                        "cjs": "always",
                        "js": "always",
                        "json": "always",
                        "mjs": "always",
                        "ts": "always"
                    }
                }
            ]
        }
    }
];

module.exports = thisConfig;
