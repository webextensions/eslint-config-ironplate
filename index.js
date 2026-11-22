// const globals = require('globals');

import { composeIronplateConfig } from './_compose-ironplate-config.js';

// The core preset (no features). For other combinations, see the other preset files or createIronplateConfig().
const thisConfig = [
    ...composeIronplateConfig({ features: {} })

    // {
    //     languageOptions: {
    //         globals: {
    //             ...globals.browser,
    //             ...globals.jest,
    //             ...globals.node
    //         }
    //     }
    // }
];

// The rules whose result can change without the linted file changing (unsafe for `eslint --cache`), see
// _cache-unsafe-rules.js
export { cacheUnsafeRules } from './_cache-unsafe-rules.js';
// createIronplateConfig() only loads the optional peerDependencies (React / TypeScript) on demand, so exporting it
// from here keeps this entry point usable without them
export { createIronplateConfig } from './_create-ironplate-config.js';
export default thisConfig;
