// Checks the `cacheUnsafeRules` export (_cache-unsafe-rules.js) against the configs: every listed rule must be
// configured (not "off") in at least one config, so that a rule renamed or removed by a plugin upgrade doesn't linger in
// the list. (Rules added by plugin upgrades show up in the rules-snapshot diff and need a manual check.)
//
// Usage:
//     $ npm run test:cache-unsafe-rules    # Part of "npm test"

import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { ESLint } from 'eslint';

// Not using "import.meta.dirname", since it is stable only from Node.js 22.16.0 (above the 22.13.0 of "engines")
const PACKAGE_DIRECTORY = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const importFromPackage = async function (file) {
    return await import(pathToFileURL(path.join(PACKAGE_DIRECTORY, file)).href);
};

test('Every rule listed in cacheUnsafeRules is configured in at least one config', async () => {
    const { cacheUnsafeRules, createIronplateConfig } = await importFromPackage('index.js');

    // The config with all the features covers every rule of every config, and these file types cover all its groups
    const eslint = new ESLint({
        cwd: PACKAGE_DIRECTORY,
        overrideConfigFile: true,
        overrideConfig: await createIronplateConfig({ node: true, react: true, typescript: true })
    });
    const activeRuleIds = new Set();
    for (const filename of ['file.js', 'file.jsx', 'file.ts', 'file.tsx']) {
        const resolvedConfig = await eslint.calculateConfigForFile(path.join(PACKAGE_DIRECTORY, 'src', filename));
        for (const [ruleId, ruleValue] of Object.entries(resolvedConfig.rules)) {
            if (ruleValue[0] !== 0) {
                activeRuleIds.add(ruleId);
            }
        }
    }

    const listedRuleIds = [
        ...cacheUnsafeRules.always,
        ...Object.values(cacheUnsafeRules.unlessSettingPinned).flat()
    ];
    const notConfigured = listedRuleIds.filter((ruleId) => !activeRuleIds.has(ruleId));
    assert.deepEqual(notConfigured, [], `Listed in cacheUnsafeRules, but not configured in any config: ${notConfigured.join(', ')}`);
});
