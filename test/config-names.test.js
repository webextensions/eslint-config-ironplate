// Checks the "name" of every flat-config object of each preset:
//     * Every object must have a name ("ironplate/<module>/<topic>"), so that new objects get one too, and
//       "npx @eslint/config-inspector" can always tell which object sets what
//     * No name may appear twice within a preset: a repeated name means the same config object got applied twice
//       (eg: a composite preset spreading two full presets, each of which includes _core.js), which silently reverts
//       the overrides placed between the two copies
//
// Usage:
//     $ npm run test:config-names    # Part of "npm test"

import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import {
    fileURLToPath,
    pathToFileURL
} from 'node:url';

// Not using "import.meta.dirname", since it is stable only from Node.js 22.16.0 (above the 22.13.0 of "engines")
const PACKAGE_DIRECTORY = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const PRESET_FILES = [
    'index.js',
    'node.js',
    'react.js',
    'typescript.js',
    'node-typescript.js',
    'react-typescript.js'
];

// All the combinations of the features of createIronplateConfig()
const FEATURE_COMBINATIONS = [false, true].flatMap((node) => [false, true].flatMap((react) => [false, true].map(
    (typescript) => ({ node, react, typescript })
)));

const assertAllNamedAndUnique = function (configArray, label) {
    const unnamedIndexes = configArray
        .map((config, index) => (typeof config.name === 'string' && config.name !== '' ? null : index))
        .filter((index) => index !== null);
    assert.deepEqual(
        unnamedIndexes,
        [],
        `Config objects without a "name" in ${label} (array indexes): ${unnamedIndexes.join(', ')}`
    );

    const names = configArray.map((config) => config.name);
    const duplicateNames = [...new Set(names.filter((name, index) => names.indexOf(name) !== index))];
    assert.deepEqual(
        duplicateNames,
        [],
        `Config names used more than once in ${label} (a config object applied twice?): ${duplicateNames.join(', ')}`
    );
};

for (const presetFile of PRESET_FILES) {
    test(`Config objects of ${presetFile} are all named, with unique names`, async () => {
        const presetUrl = pathToFileURL(path.join(PACKAGE_DIRECTORY, presetFile)).href;
        const { default: presetConfig } = await import(presetUrl);

        assertAllNamedAndUnique(presetConfig, presetFile);
    });
}

for (const features of FEATURE_COMBINATIONS) {
    const label = `createIronplateConfig(${JSON.stringify(features)})`;
    test(`Config objects of ${label} are all named, with unique names`, async () => {
        const { createIronplateConfig } = await import(pathToFileURL(path.join(PACKAGE_DIRECTORY, 'index.js')).href);

        assertAllNamedAndUnique(await createIronplateConfig(features), label);
    });
}
