// Snapshot test of the rules that each preset of this package resolves to.
//
// Why: The presets spread whole "recommended" rule sets of their plugins (and the plugins are peerDependencies with
// loose version ranges), so a routine plugin upgrade can silently add, remove or reconfigure many rules for every
// consumer. Likewise, an override placed in the wrong order can silently revert other overrides. The fixture tests
// under "test/<preset>/" only prove that clean code still passes, so they can't catch such changes. This test
// resolves the final rule set of every preset (via ESLint's own config resolution) and compares it with the committed
// JSON files under "test/rules-snapshot/", so that any change shows up as a failing test and then as a reviewable diff.
//
// Usage:
//     $ npm run test:rules           # Compare (part of "npm test")
//     $ npm run test:rules:update    # Accept the current rule sets (rewrites the JSON files; review the git diff!)
//
// File naming: "<preset>.<extension>.json", eg: "typescript.ts.json" holds what "typescript.js" resolves to for a
// ".ts" file. Feature combinations which have no preset file are resolved via createIronplateConfig() and named
// "factory-<features>.<extension>.json". Extensions which resolve identically within a config (eg: .js/.cjs/.mjs, or
// .ts/.cts/.mts) are represented by one of them.
//
// File format: one rule per line (rather than one array element per line), so that the files stay small and a changed
// rule shows up as a one-line diff.
//
// Only "linterOptions" and "rules" are recorded: "settings" can hold non-serializable values (eg: the resolver object
// of "import-x/resolver-next").

import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

import { ESLint } from 'eslint';

// Not using "import.meta.dirname", since it is stable only from Node.js 22.16.0 (above the 22.13.0 of "engines")
const TEST_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_DIRECTORY = path.resolve(TEST_DIRECTORY, '..');
const SNAPSHOT_DIRECTORY = path.join(TEST_DIRECTORY, 'rules-snapshot');

const importFromPackage = async function (file) {
    return await import(pathToFileURL(path.join(PACKAGE_DIRECTORY, file)).href);
};

const presetEntry = function (presetFile, extensions) {
    return {
        label: presetFile,
        snapshotPrefix: path.basename(presetFile, '.js'),
        loadConfig: async () => (await importFromPackage(presetFile)).default,
        extensions
    };
};

const factoryEntry = function (features, extensions) {
    return {
        label: `createIronplateConfig(${JSON.stringify(features)})`,
        snapshotPrefix: `factory-${Object.keys(features).join('-')}`,
        loadConfig: async () => await (await importFromPackage('index.js')).createIronplateConfig(features),
        extensions
    };
};

// The configs to snapshot, with the representative file extensions to resolve the rules for. Together, the preset
// files and the factory entries cover all the combinations of the "node", "react" and "typescript" features.
const SNAPSHOT_MATRIX = [
    presetEntry('index.js', ['js']),
    presetEntry('node.js', ['js']),
    presetEntry('react.js', ['jsx']),
    presetEntry('typescript.js', ['js', 'ts', 'tsx']),
    presetEntry('node-typescript.js', ['js', 'ts', 'tsx']),
    presetEntry('react-typescript.js', ['jsx', 'ts', 'tsx']),
    factoryEntry({ node: true, react: true }, ['jsx']),
    factoryEntry({ node: true, react: true, typescript: true }, ['jsx', 'ts', 'tsx'])
];

const { values: cliOptions } = parseArgs({
    options: {
        update: { type: 'boolean', default: false }
    }
});

// Plain code-point order (not locale-aware), so that the snapshot files are identical on every machine
const compareStrings = function (a, b) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
};

const sortObjectByKeys = function (object) {
    const sortedKeys = Object.keys(object).toSorted(compareStrings);
    return Object.fromEntries(sortedKeys.map((key) => [key, object[key]]));
};

// A JSON value on a single line, eg: `[ 2, 4, { "SwitchCase": 1 } ]`. Collapsing the line breaks (and the indentation
// after them) of the pretty-printed form only touches whitespace between tokens, since JSON strings can't contain raw
// line breaks.
const toSingleLineJson = function (value) {
    return JSON.stringify(value, null, 1).replaceAll(/\n\s*/g, ' ');
};

const serializeSnapshot = function ({ linterOptions, rules }) {
    const ruleLines = Object.entries(rules).map(([ruleId, ruleValue]) => `        ${JSON.stringify(ruleId)}: ${toSingleLineJson(ruleValue)}`);
    return [
        '{',
        `    "linterOptions": ${toSingleLineJson(linterOptions)},`,
        '    "rules": {',
        ruleLines.join(',\n'),
        '    }',
        '}',
        ''
    ].join('\n');
};

const resolveSnapshot = async function (config, extension) {
    // "overrideConfigFile: true" ignores any eslint.config.js on disk, so that exactly the given config gets resolved
    const eslint = new ESLint({
        cwd: PACKAGE_DIRECTORY,
        overrideConfigFile: true,
        overrideConfig: config
    });

    // The file doesn't need to exist, the config is resolved from its path only
    const resolvedConfig = await eslint.calculateConfigForFile(path.join(PACKAGE_DIRECTORY, 'src', `file.${extension}`));

    return {
        linterOptions: sortObjectByKeys(resolvedConfig.linterOptions),
        rules: sortObjectByKeys(resolvedConfig.rules)
    };
};

// A compact "what changed" summary, since a full deep-equality diff of 600+ rules is hard to read
const describeRuleChanges = function (expectedRules, actualRules) {
    const expectedRuleIds = new Set(Object.keys(expectedRules));
    const actualRuleIds = new Set(Object.keys(actualRules));

    const added = [...actualRuleIds.difference(expectedRuleIds)];
    const removed = [...expectedRuleIds.difference(actualRuleIds)];
    const changed = [...actualRuleIds].filter(
        (ruleId) => expectedRuleIds.has(ruleId) && JSON.stringify(expectedRules[ruleId]) !== JSON.stringify(actualRules[ruleId])
    );

    const lines = [];
    if (added.length > 0) {
        lines.push(`  added   (${added.length}): ${added.join(', ')}`);
    }
    if (removed.length > 0) {
        lines.push(`  removed (${removed.length}): ${removed.join(', ')}`);
    }
    for (const ruleId of changed) {
        lines.push(`  changed: ${ruleId}  ${JSON.stringify(expectedRules[ruleId])} -> ${JSON.stringify(actualRules[ruleId])}`);
    }
    return lines;
};

// One test per snapshot file
for (const { label, snapshotPrefix, loadConfig, extensions } of SNAPSHOT_MATRIX) {
    for (const extension of extensions) {
        const snapshotName = `${snapshotPrefix}.${extension}.json`;
        const snapshotPath = path.join(SNAPSHOT_DIRECTORY, snapshotName);

        test(`Resolved rules of ${label} (.${extension}) match test/rules-snapshot/${snapshotName}`, async () => {
            const actual = await resolveSnapshot(await loadConfig(), extension);

            if (cliOptions.update) {
                await writeFile(snapshotPath, serializeSnapshot(actual));
                return;
            }

            const expected = JSON.parse(await readFile(snapshotPath, 'utf8'));
            const changeLines = [
                ...(
                    JSON.stringify(expected.linterOptions) === JSON.stringify(actual.linterOptions) ?
                        [] :
                        [`  linterOptions: ${JSON.stringify(expected.linterOptions)} -> ${JSON.stringify(actual.linterOptions)}`]
                ),
                ...describeRuleChanges(expected.rules, actual.rules)
            ];

            assert.deepEqual(
                changeLines,
                [],
                [
                    `Resolved rules changed for ${label} (.${extension}):`,
                    ...changeLines,
                    'Run "npm run test:rules:update" to accept them, then review the git diff before committing.'
                ].join('\n')
            );
        });
    }
}
