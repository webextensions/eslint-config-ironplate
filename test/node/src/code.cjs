// CommonJS smoke test

const path = require('node:path');

console.log(path.sep);
console.log(__filename);

// eslint-disable-next-line eqeqeq
if (path.sep == '/') {
    console.log('eqeqeq is active and disabled just for the line above');
}

module.exports = {
    name: 'cjs-fixture'
};
