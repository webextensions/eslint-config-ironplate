// Tests of the public createIronplateConfig() factory:
//     * Each preset file produces the same config as the factory with the matching features (the preset files are thin
//       wrappers, this keeps them that way)
//     * Invalid options are rejected (eg: a typo like `{ ts: true }` must not silently produce a weaker config)
//
// Usage:
//     $ npm run test:factory    # Part of "npm test"

import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Not using "import.meta.dirname", since it is stable only from Node.js 22.16.0 (above the 22.13.0 of "engines")
const PACKAGE_DIRECTORY = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const importFromPackage = async function (file) {
    return await import(pathToFileURL(path.join(PACKAGE_DIRECTORY, file)).href);
};

const PRESET_FEATURES = {
    'index.js': {},
    'node.js': { node: true },
    'react.js': { react: true },
    'typescript.js': { typescript: true },
    'node-typescript.js': { node: true, typescript: true },
    'react-typescript.js': { react: true, typescript: true }
};

// A comparable summary of a config array: the name, files and rules of each config object (plugin and parser objects
// are left out, they are the same module instances either way)
const summarizeConfig = function (configArray) {
    return configArray.map((config) => ({
        name: config.name,
        files: config.files,
        rules: config.rules
    }));
};

for (const [presetFile, features] of Object.entries(PRESET_FEATURES)) {
    test(`${presetFile} matches createIronplateConfig(${JSON.stringify(features)})`, async () => {
        const { default: presetConfig } = await importFromPackage(presetFile);
        const { createIronplateConfig } = await importFromPackage('index.js');

        assert.deepEqual(summarizeConfig(presetConfig), summarizeConfig(await createIronplateConfig(features)));
    });
}

test('createIronplateConfig() rejects unknown options and non-boolean values', async () => {
    const { createIronplateConfig } = await importFromPackage('index.js');

    await assert.rejects(createIronplateConfig({ ts: true }), { name: 'TypeError', message: /Unknown option "ts"/ });
    await assert.rejects(createIronplateConfig({ react: 'yes' }), { name: 'TypeError', message: /must be a boolean/ });
    await assert.rejects(createIronplateConfig(null), { name: 'TypeError', message: /Expected an options object/ });
});
