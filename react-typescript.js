import { composeIronplateConfig } from './_compose-ironplate-config.js';
import { createReactConfigs } from './_react.js';
import { createTypeScriptConfigs } from './_typescript.js';

// Same as `await createIronplateConfig({ react: true, typescript: true })`
const thisConfig = composeIronplateConfig({
    features: { react: true, typescript: true },
    createReactConfigs,
    createTypeScriptConfigs
});

export default thisConfig;
