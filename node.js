import { composeIronplateConfig } from './_compose-ironplate-config.js';

// Same as `await createIronplateConfig({ node: true })`
const thisConfig = composeIronplateConfig({ features: { node: true } });

export default thisConfig;
