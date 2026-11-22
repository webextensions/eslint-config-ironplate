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

// createIronplateConfig() only loads the optional peerDependencies (React / TypeScript) on demand, so exporting it
// from here keeps this entry point usable without them
export { createIronplateConfig } from './_create-ironplate-config.js';
export default thisConfig;
