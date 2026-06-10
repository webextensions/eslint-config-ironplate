/* globals alert */

const a = [
    1,
    2,
    3,
    4
];
console.log(a);

// eslint-disable-next-line no-restricted-globals
console.log(__dirname);
console.log(__filename);

// eslint-disable-next-line no-alert
alert(123);

// "no-unassigned-vars" got added to "eslint:recommended" in ESLint 10
// eslint-disable-next-line no-unassigned-vars
let unassignedVariable;
console.log(unassignedVariable);

jQuery(() => {
    // eslint-disable-next-line no-constant-condition
    if (true) {
            // eslint-disable-next-line @stylistic/indent
            console.log('true');
    }
});
