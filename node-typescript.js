import { composeIronplateConfig } from './_compose-ironplate-config.js';
import { createTypeScriptConfigs } from './_typescript.js';

// Same as `await createIronplateConfig({ node: true, typescript: true })`
const thisConfig = composeIronplateConfig({ features: { node: true, typescript: true }, createTypeScriptConfigs });

export default thisConfig;
