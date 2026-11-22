import { composeIronplateConfig } from './_compose-ironplate-config.js';
import { createTypeScriptConfigs } from './_typescript.js';

// Same as `await createIronplateConfig({ typescript: true })`
const thisConfig = composeIronplateConfig({ features: { typescript: true }, createTypeScriptConfigs });

export default thisConfig;
