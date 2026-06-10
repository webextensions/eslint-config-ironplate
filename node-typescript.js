import coreConfig from './_core.js';
import { nodeDelta } from './node.js';
import { typeScriptDelta } from './typescript.js';

// Compose "core + deltas" so that the core config applies only once (spreading the full node.js and typescript.js
// configs would apply it twice, silently reverting the overrides in between).
const thisConfig = [
    ...coreConfig,
    ...nodeDelta,
    ...typeScriptDelta
];

export default thisConfig;
