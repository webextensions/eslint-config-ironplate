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
                        "js": "always",
                        "json": "always",
                        "ts": "never",
                        "tsx": "never"
                    }
                }
            ]
        }
    }
];

module.exports = thisConfig;
