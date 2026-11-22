// "Canary" tests: small code samples with known problems, linted with each config, asserting that the expected rules
// actually report them (and that deliberately scoped-out rules don't).
//
// Why: test/rules-snapshot.test.js proves which rules are configured, but not that they work. A rule can be configured
// and still check nothing, eg: when a plugin's parser wiring breaks, or (as found for "import-x/named" on TypeScript
// imports) when the plugin skips some files. One canary per plugin and file group is enough to prove the wiring.
//
// Each canary runs under every config whose features support its file type (.jsx needs "react", .ts/.tsx need
// "typescript") and match its optional `when` condition. The checks are subsets: other rules may report problems too.
// A parse error always fails, since it would make a "must not report" check pass without checking anything.
//
// Usage:
//     $ npm run test:canaries    # Part of "npm test"

import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { ESLint } from 'eslint';

// Not using "import.meta.dirname", since it is stable only from Node.js 22.16.0 (above the 22.13.0 of "engines")
const TEST_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_DIRECTORY = path.resolve(TEST_DIRECTORY, '..');

// The canary files are linted as if they were in this directory, which holds the real modules that the import
// canaries import (targetJs.js)
const CANARY_DIRECTORY = path.join(TEST_DIRECTORY, 'canaries');

const importFromPackage = async function (file) {
    return await import(pathToFileURL(path.join(PACKAGE_DIRECTORY, file)).href);
};

// Every config, with its features. Together, the preset files and the factory-only combinations cover all the
// combinations of the "node", "react" and "typescript" features.
const CONFIGS = [
    { label: 'index.js', features: {}, presetFile: 'index.js' },
    { label: 'node.js', features: { node: true }, presetFile: 'node.js' },
    { label: 'react.js', features: { react: true }, presetFile: 'react.js' },
    { label: 'typescript.js', features: { typescript: true }, presetFile: 'typescript.js' },
    { label: 'node-typescript.js', features: { node: true, typescript: true }, presetFile: 'node-typescript.js' },
    { label: 'react-typescript.js', features: { react: true, typescript: true }, presetFile: 'react-typescript.js' },
    { label: 'createIronplateConfig({ node, react })', features: { node: true, react: true } },
    { label: 'createIronplateConfig({ node, react, typescript })', features: { node: true, react: true, typescript: true } }
];

const loadConfig = async function ({ features, presetFile }) {
    if (presetFile) {
        return (await importFromPackage(presetFile)).default;
    }
    const { createIronplateConfig } = await importFromPackage('index.js');
    return await createIronplateConfig(features);
};

const supportsFile = function (features, filename) {
    const extension = path.extname(filename);
    if (extension === '.jsx') {
        return Boolean(features.react);
    }
    if (extension === '.ts' || extension === '.tsx') {
        return Boolean(features.typescript);
    }
    return true;
};

const COMPONENT_WITH_CONDITIONAL_HOOK = [
    'import { useState } from \'react\';',
    '',
    'export const Toggle = function ({ enabled }) {',
    '    if (enabled) {',
    '        useState(0);',
    '    }',
    '    return null;',
    '};',
    ''
].join('\n');

const CANARIES = [
    // Core ESLint rules
    {
        name: 'eqeqeq (core)',
        filenames: ['canary.js', 'canary.ts'],
        code: 'const count = Number(\'1\');\n\nexport const isOne = count == 1;\n',
        expect: ['eqeqeq']
    },

    // @stylistic
    {
        name: '@stylistic/indent',
        filenames: ['canary.js', 'canary.ts'],
        code: 'export const getOne = function () {\n  return 1;\n};\n',
        expect: ['@stylistic/indent']
    },
    {
        name: '@stylistic/jsx-indent-props (React files, and .tsx under any TypeScript config)',
        filenames: ['Canary.jsx', 'Canary.tsx'],
        code: [
            'export const Card = function () {',
            '    return (',
            '        <div',
            '          className="card"',
            '        />',
            '    );',
            '};',
            ''
        ].join('\n'),
        expect: ['@stylistic/jsx-indent-props']
    },

    // import-x
    {
        name: 'import-x/named (JavaScript import target)',
        filenames: ['canary.js'],
        code: 'import { missingName } from \'./targetJs.js\';\n\nexport const value = missingName;\n',
        expect: ['import-x/named']
    },
    {
        // Imports a JavaScript module on purpose: "import-x/named" never checks TypeScript import targets (see
        // _typescript.js), so a .ts target would pass even with the rule turned on, proving nothing
        name: 'import-x/named is off for TypeScript files (TypeScript reports it, see _typescript.js)',
        filenames: ['canary.ts'],
        code: 'import { missingName } from \'./targetJs.js\';\n\nexport const value = missingName;\n',
        expectAbsent: ['import-x/named']
    },
    {
        name: 'import-x/extensions (missing extension of a local import)',
        filenames: ['canary.js', 'canary.ts'],
        code: 'import { realNamedJs } from \'./targetJs\';\n\nexport const value = realNamedJs;\n',
        expect: ['import-x/extensions']
    },
    {
        name: 'import-x/extensions (missing extension of a type-only import)',
        filenames: ['canary.ts'],
        code: 'import type { realNamedJs } from \'./targetJs\';\n\nexport const value: typeof realNamedJs = 1;\n',
        expect: ['import-x/extensions']
    },
    {
        name: 'import-x/no-unresolved',
        filenames: ['canary.js', 'canary.ts'],
        code: 'import { something } from \'./does-not-exist.js\';\n\nexport const value = something;\n',
        expect: ['import-x/no-unresolved']
    },

    // n
    {
        name: 'n/callback-return',
        filenames: ['canary.js'],
        code: [
            'export const run = function (callback) {',
            '    if (Number(\'1\') > 0) {',
            '        callback(null);',
            '    }',
            '    console.log(\'after\');',
            '};',
            ''
        ].join('\n'),
        expect: ['n/callback-return']
    },
    {
        name: 'n/no-unsupported-features/node-builtins (Node.js configs)',
        filenames: ['canary.js'],
        when: (features) => Boolean(features.node),
        settings: { n: { version: '>=20.0.0' } },
        code: 'export const directory = import.meta.dirname;\n',
        expect: ['n/no-unsupported-features/node-builtins']
    },
    {
        name: 'n/no-unsupported-features/es-syntax (Node.js configs)',
        filenames: ['canary.js'],
        when: (features) => Boolean(features.node),
        settings: { n: { version: '>=8.0.0' } },
        code: 'const settings = { theme: { color: \'red\' } };\n\nexport const color = settings.theme?.color;\n',
        expect: ['n/no-unsupported-features/es-syntax']
    },
    {
        name: 'n/no-unsupported-features/es-syntax is off without the "node" feature',
        filenames: ['canary.js'],
        when: (features) => !features.node,
        settings: { n: { version: '>=8.0.0' } },
        code: 'const settings = { theme: { color: \'red\' } };\n\nexport const color = settings.theme?.color;\n',
        expectAbsent: ['n/no-unsupported-features/es-syntax']
    },

    // promise
    {
        name: 'promise/param-names',
        filenames: ['canary.js'],
        code: 'export const ready = new Promise(function (ok) {\n    ok(1);\n});\n',
        expect: ['promise/param-names']
    },

    // unicorn
    {
        name: 'unicorn/prefer-node-protocol',
        filenames: ['canary.js'],
        code: 'import { readFileSync } from \'fs\';\n\nexport const read = readFileSync;\n',
        expect: ['unicorn/prefer-node-protocol']
    },

    // typescript-eslint
    {
        name: '@typescript-eslint/no-unused-vars',
        filenames: ['canary.ts'],
        code: 'const unusedValue: number = 1;\n\nexport const usedValue: number = 2;\n',
        expect: ['@typescript-eslint/no-unused-vars']
    },

    // React
    {
        name: 'react-hooks/rules-of-hooks',
        filenames: ['Canary.jsx', 'Canary.tsx'],
        when: (features) => Boolean(features.react),
        code: COMPONENT_WITH_CONDITIONAL_HOOK,
        expect: ['react-hooks/rules-of-hooks']
    },
    {
        name: 'react-refresh/only-export-components',
        filenames: ['Canary.jsx', 'Canary.tsx'],
        when: (features) => Boolean(features.react),
        code: 'export const Badge = function () {\n    return <span />;\n};\n\nexport const badgeCount = 1;\n',
        expect: ['react-refresh/only-export-components']
    },
    {
        name: '@eslint-react/no-array-index-key',
        filenames: ['Canary.jsx', 'Canary.tsx'],
        when: (features) => Boolean(features.react),
        code: [
            'export const List = function ({ items }) {',
            '    return (',
            '        <ul>',
            '            {items.map((item, index) => <li key={index}>{item}</li>)}',
            '        </ul>',
            '    );',
            '};',
            ''
        ].join('\n'),
        expect: ['@eslint-react/no-array-index-key']
    }
];

for (const configEntry of CONFIGS) {
    for (const canary of CANARIES) {
        const applicableFilenames = canary.filenames.filter((filename) => supportsFile(configEntry.features, filename));
        if (applicableFilenames.length === 0 || (canary.when && !canary.when(configEntry.features))) {
            continue;
        }

        test(`${configEntry.label}: ${canary.name}`, async () => {
            const config = await loadConfig(configEntry);
            const eslint = new ESLint({
                cwd: PACKAGE_DIRECTORY,
                // "overrideConfigFile: true" ignores any eslint.config.js on disk, so that exactly the config under
                // test gets used
                overrideConfigFile: true,
                overrideConfig: [
                    ...config,
                    ...(canary.settings ? [{ name: 'canary/settings', settings: canary.settings }] : [])
                ]
            });

            const expectedRuleIds = canary.expect ?? [];
            const absentRuleIds = canary.expectAbsent ?? [];

            for (const filename of applicableFilenames) {
                const [result] = await eslint.lintText(canary.code, { filePath: path.join(CANARY_DIRECTORY, filename) });
                const reportedRuleIds = new Set(result.messages.map((message) => message.ruleId));
                const describeReported = () => JSON.stringify(result.messages.map((message) => `${message.line}: ${message.ruleId}: ${message.message}`), null, 4);

                const fatalMessages = result.messages.filter((message) => message.fatal);
                assert.deepEqual(fatalMessages, [], `${filename}: unexpected parse error`);

                for (const ruleId of expectedRuleIds) {
                    assert.ok(reportedRuleIds.has(ruleId), `${filename}: expected "${ruleId}" to report, got: ${describeReported()}`);
                }
                for (const ruleId of absentRuleIds) {
                    assert.ok(!reportedRuleIds.has(ruleId), `${filename}: expected "${ruleId}" NOT to report, got: ${describeReported()}`);
                }
            }
        });
    }
}
