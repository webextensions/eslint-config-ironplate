// Tests of the "react-x.version" setting of the React configs (resolveReactVersion() in _react.js):
//     * With "react" installed for the working directory, the setting is the version that @eslint-react's own
//       'detect' would resolve to (so pinning it changes no rule's behavior, it only makes the value part of the
//       resolved config, which `eslint --cache` keys on)
//     * Without "react", the setting stays 'detect'
//
// Each case runs in a child process, since the version gets resolved from the working directory when the config
// module loads.
//
// Usage:
//     $ npm run test:react-version    # Part of "npm test"

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { test } from 'node:test';
import {
    fileURLToPath,
    pathToFileURL
} from 'node:url';

// Not using "import.meta.dirname", since it is stable only from Node.js 22.16.0 (above the 22.13.0 of "engines")
const TEST_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_DIRECTORY = path.resolve(TEST_DIRECTORY, '..');

// The React fixture project, which has "react" installed (the package directory itself doesn't)
const REACT_FIXTURE_DIRECTORY = path.join(TEST_DIRECTORY, 'react');

// Prints `{ pinned, detected }` as JSON: the "react-x.version" setting of the react.js preset, and what @eslint-react
// resolves 'detect' to (with a fallback marker, to tell "not resolvable" apart from a version)
const PROBE_SCRIPT = `
    const { default: config } = await import(${JSON.stringify(pathToFileURL(path.join(PACKAGE_DIRECTORY, 'react.js')).href)});
    const { getReactVersion } = await import(${JSON.stringify(pathToFileURL(path.join(PACKAGE_DIRECTORY, 'node_modules/@eslint-react/shared/dist/index.js')).href)});
    const versions = config.map((entry) => entry.settings?.['react-x']?.version).filter(Boolean);
    console.log(JSON.stringify({ pinned: versions.at(-1), detected: getReactVersion('NOT_RESOLVABLE') }));
`;

const runProbe = function (cwd) {
    const output = execFileSync(process.execPath, ['--input-type=module', '--eval', PROBE_SCRIPT], { cwd, encoding: 'utf8' });
    return JSON.parse(output);
};

test('react-x.version is pinned to what "detect" resolves to, when react is installed', () => {
    const { pinned, detected } = runProbe(REACT_FIXTURE_DIRECTORY);
    assert.notEqual(detected, 'NOT_RESOLVABLE', 'the React fixture project must have "react" installed (npm run test:data installs it)');
    assert.equal(pinned, detected);
});

test('react-x.version stays "detect" when react does not resolve', () => {
    const { pinned, detected } = runProbe(PACKAGE_DIRECTORY);
    assert.equal(detected, 'NOT_RESOLVABLE', 'expected "react" not to resolve from the package directory');
    assert.equal(pinned, 'detect');
});
