// ESLint configuration

module.exports = {
    // Tells ESLint to start at the root of the project
    root: true,

    // Extend the rulesets to apply a wider range of linting rules
    extends: [
        'eslint-config-ironplate/node'
    ],

    rules: {
        'no-restricted-globals': ['error', { name: '__dirname' }]
    },

    // Optionally, you may define globals here, those are not automatically defined
    // based on the environments you set under the "env" key
    globals: {
        jQuery: true // This sets the global variable "jQuery" to read-only
    }
};
