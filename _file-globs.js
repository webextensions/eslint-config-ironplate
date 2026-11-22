// File globs shared by the config blocks. Kept in this dependency-free module (rather than in _react.js /
// _typescript.js), so that the always-loaded blocks (eg: the JSX stylistic block in _core.js) can use them without
// importing the optional peerDependencies that _react.js and _typescript.js import.

// The files that the React blocks apply to (without the TypeScript extensions: plain-React projects must not lint
// TypeScript files, which would happen without a TypeScript parser)
const reactFileGlobs = [
    '**/*.cjs',
    '**/*.js',
    '**/*.jsx',
    '**/*.mjs'
];

const typeScriptFileGlobs = [
    '**/*.cts',
    '**/*.mts',
    '**/*.ts',
    '**/*.tsx'
];

export { reactFileGlobs, typeScriptFileGlobs };
