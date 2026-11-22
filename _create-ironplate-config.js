// The public config factory: `createIronplateConfig({ node, react, typescript })` (exported by index.js).
//
// Async, because the React and TypeScript blocks import optional peerDependencies (the react-family plugins,
// "typescript" and "typescript-eslint"): they get loaded on demand, only when their feature is selected, so that
// projects without them (eg: a Node.js-only project) can still use this factory.
//
// Usage (in eslint.config.js):
//     import { createIronplateConfig } from 'eslint-config-ironplate';
//
//     export default [
//         ...(await createIronplateConfig({ node: true, typescript: true }))
//     ];

import {
    composeIronplateConfig,
    validateFeatures
} from './_compose-ironplate-config.js';

const OPTIONAL_PEER_DEPENDENCIES = {
    react: ['@eslint-react/eslint-plugin', 'eslint-plugin-react-hooks', 'eslint-plugin-react-refresh'],
    typescript: ['typescript', 'typescript-eslint']
};

// Imports the block of an optional feature, turning a missing peerDependency into an actionable error message
const importFeatureBlock = async function (featureName, importBlock) {
    try {
        return await importBlock();
    } catch (error) {
        // "ERR_MODULE_NOT_FOUND" for ES modules, "MODULE_NOT_FOUND" for a require() inside a CommonJS dependency
        if (error?.code === 'ERR_MODULE_NOT_FOUND' || error?.code === 'MODULE_NOT_FOUND') {
            throw new Error(
                [
                    `eslint-config-ironplate: createIronplateConfig({ ${featureName}: true }) needs these optional`,
                    `peerDependencies to be installed: ${OPTIONAL_PEER_DEPENDENCIES[featureName].join(', ')}`,
                    `(eg: $ npm install --save-dev ${OPTIONAL_PEER_DEPENDENCIES[featureName].join(' ')})`
                ].join(' '),
                { cause: error }
            );
        }
        throw error;
    }
};

const createIronplateConfig = async function (features = {}) {
    // Validate before loading anything, so that a typo in an option name is reported as such
    validateFeatures(features);

    const { react = false, typescript = false } = features;

    // The import specifiers are written out literally (rather than computed), so that bundlers and tools can follow them
    const { createReactConfigs } = react ? await importFeatureBlock('react', () => import('./_react.js')) : {};
    const { createTypeScriptConfigs } = typescript ? await importFeatureBlock('typescript', () => import('./_typescript.js')) : {};

    return composeIronplateConfig({ features, createReactConfigs, createTypeScriptConfigs });
};

export { createIronplateConfig };
