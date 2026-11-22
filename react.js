import { composeIronplateConfig } from './_compose-ironplate-config.js';
import { createReactConfigs } from './_react.js';

// Same as `await createIronplateConfig({ react: true })`
const thisConfig = composeIronplateConfig({ features: { react: true }, createReactConfigs });

export default thisConfig;
