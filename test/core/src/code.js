// Core (default export) config smoke test

// eslint-disable-next-line eqeqeq
if (process.platform == 'linux') {
    console.log('eqeqeq is active and disabled just for the line above');
}

// "no-unassigned-vars" got added to "eslint:recommended" in ESLint 10
// eslint-disable-next-line no-unassigned-vars
let unassignedVariable;
console.log(unassignedVariable);

// eslint-disable-next-line unicorn/no-zero-fractions
const ratio = 1.0;
// eslint-disable-next-line @stylistic/indent
    console.log(ratio);

// eslint-disable-next-line promise/catch-or-return, unicorn/prefer-await
Promise.resolve('proves "eslint-plugin-promise" rules are active').then((value) => console.log(value));

// "@stylistic/list-style" checks braces only: arrays may still group several items per line
const PROTOCOL_GROUPS = [
    'git+https://', 'git+ssh://',
    'https://', 'http://'
];
console.log(PROTOCOL_GROUPS);
// eslint-disable-next-line @stylistic/list-style
const point = {x: 1};
console.log(point);
