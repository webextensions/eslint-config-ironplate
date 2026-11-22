// Checks which file types each config makes ESLint lint. In flat config, every "files" pattern which doesn't end with
// "/*" or "/**" also opts the matching files into linting, so a config object scoped via eg: `files: ['**/*.test.*']`
// would silently make a JavaScript-only config lint "x.test.ts" (with a parser that can't parse TypeScript) or
// "x.test.tsx.snap". This test pins the expected file types per feature:
//     * .js / .cjs / .mjs: always (ESLint's defaults)
//     * .jsx: with the "react" feature
//     * .ts / .cts / .mts / .tsx: with the "typescript" feature
//     * anything else (eg: .json, .snap): never
//
// Usage:
//     $ npm run test:linted-files    # Part of "npm test"

import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { ESLint } from 'eslint';

// Not using "import.meta.dirname", since it is stable only from Node.js 22.16.0 (above the 22.13.0 of "engines")
const PACKAGE_DIRECTORY = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// All the combinations of the features of createIronplateConfig()
const FEATURE_COMBINATIONS = [false, true].flatMap((node) => [false, true].flatMap((react) => [false, true].map(
    (typescript) => ({ node, react, typescript })
)));

// Plain files, and the same extensions in test files and test directories (which some config objects treat specially)
const SAMPLE_FILES = ['src/file', 'src/file.test', 'src/file.spec', 'test/file'].flatMap(
    (basePath) => ['cjs', 'cts', 'js', 'json', 'jsx', 'mjs', 'mts', 'snap', 'ts', 'tsx', 'tsx.snap'].map(
        (extension) => `${basePath}.${extension}`
    )
);

const isExpectedToBeLinted = function (filePath, { react, typescript }) {
    const extension = filePath.slice(filePath.lastIndexOf('.') + 1);
    if (['cjs', 'js', 'mjs'].includes(extension)) {
        return true;
    }
    if (extension === 'jsx') {
        return react;
    }
    if (['cts', 'mts', 'ts', 'tsx'].includes(extension)) {
        return typescript;
    }
    return false;
};

for (const features of FEATURE_COMBINATIONS) {
    test(`createIronplateConfig(${JSON.stringify(features)}) lints only the file types of its features`, async () => {
        const { createIronplateConfig } = await import(pathToFileURL(path.join(PACKAGE_DIRECTORY, 'index.js')).href);
        const eslint = new ESLint({
            cwd: PACKAGE_DIRECTORY,
            overrideConfigFile: true,
            overrideConfig: await createIronplateConfig(features)
        });

        const mismatches = [];
        for (const filePath of SAMPLE_FILES) {
            // The file doesn't need to exist, the config is resolved from its path only
            const isLinted = (await eslint.calculateConfigForFile(path.join(PACKAGE_DIRECTORY, filePath))) !== undefined;
            if (isLinted !== isExpectedToBeLinted(filePath, features)) {
                mismatches.push(`${filePath} (${isLinted ? 'linted, but should not be' : 'not linted, but should be'})`);
            }
        }
        assert.deepEqual(mismatches, [], `Unexpected linted file types: ${mismatches.join(', ')}`);
    });
}
