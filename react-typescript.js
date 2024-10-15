const reactConfig = require('./react.js');
const typeScriptConfig = require('./typescript.js');

const thisConfig = [
    ...reactConfig,
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
                        "jsx": "always",
                        "ts": "always",
                        "tsx": "always"
                    }
                }
            ]
        }
    }
];

// NOTE: When using this config, set this in config manually
// thisConfig.parser = "@typescript-eslint/parser";

module.exports = [...thisConfig];
