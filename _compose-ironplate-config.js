// Assembles the config array for a set of features. The single place where the config objects of the features get
// combined (and in which order), so that each rule is decided once instead of features overriding each other.
//
// Synchronous on purpose: the preset entry files (index.js, node.js, react.js, ...) use it directly with the blocks
// they import statically, while the public async createIronplateConfig() (_create-ironplate-config.js) uses it after
// loading the optional blocks on demand. The React and TypeScript blocks are passed in (rather than imported here),
// because they import optional peerDependencies, which must not be loaded for projects that don't use them.

import { createCoreConfigs } from './_core.js';
import { createNodeConfigs } from './_node.js';

const FEATURE_NAMES = ['node', 'react', 'typescript'];

// Throws a TypeError for unknown option names (eg: a typo like `{ ts: true }`, which would otherwise silently produce
// a config without the TypeScript rules) and for non-boolean values
const validateFeatures = function (features) {
    if (features === null || typeof features !== 'object' || Array.isArray(features)) {
        throw new TypeError(
            `eslint-config-ironplate: Expected an options object like { node, react, typescript }, received: ${String(features)}`
        );
    }
    for (const [optionName, optionValue] of Object.entries(features)) {
        if (!FEATURE_NAMES.includes(optionName)) {
            throw new TypeError(
                `eslint-config-ironplate: Unknown option "${optionName}" (supported options: ${FEATURE_NAMES.join(', ')})`
            );
        }
        if (typeof optionValue !== 'boolean' && optionValue !== undefined) {
            throw new TypeError(
                `eslint-config-ironplate: Option "${optionName}" must be a boolean, received: ${JSON.stringify(optionValue)}`
            );
        }
    }
};

const composeIronplateConfig = function ({ features, createReactConfigs, createTypeScriptConfigs }) {
    validateFeatures(features);

    const { node = false, react = false, typescript = false } = features;

    // Internal consistency checks (a preset entry file / the factory must pass the blocks of the selected features)
    if (react && !createReactConfigs) {
        throw new Error('eslint-config-ironplate (internal): The "react" feature needs createReactConfigs');
    }
    if (typescript && !createTypeScriptConfigs) {
        throw new Error('eslint-config-ironplate (internal): The "typescript" feature needs createTypeScriptConfigs');
    }

    return [
        ...createCoreConfigs({ react, typescript }),
        ...(node ? createNodeConfigs() : []),
        ...(react ? createReactConfigs({ typescript }) : []),
        ...(typescript ? createTypeScriptConfigs() : [])
    ];
};

export { composeIronplateConfig, validateFeatures };
