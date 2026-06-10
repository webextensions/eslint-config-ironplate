#!/usr/bin/env node

// Colors:
// https://stackoverflow.com/questions/5412761/using-colors-with-printf/5413029#5413029
// https://stackoverflow.com/questions/5947742/how-to-change-the-output-color-of-echo-in-linux/5947802#5947802
const NORMAL = '\u001B[0m';    // NORMAL=$(tput sgr0)
const BLUE   = '\u001B[0;34m'; //   BLUE=$(tput setaf 4)

const lines = [
    '',
    '',
    `${BLUE}If you are installing "eslint-config-ironplate" as a package, then:${NORMAL}`,
    '     To list its peerDependencies:',
    '         $ npm info "eslint-config-ironplate" peerDependencies',
    "         And add these dependencies to your project's package.json file",
    '     To install its peerDependencies:',
    '         $ npx install-peerdeps --dev eslint-config-ironplate',
    '     Note:',
    '         The react-family peerDependencies (@eslint-react/eslint-plugin, eslint-plugin-react-hooks',
    '         and eslint-plugin-react-refresh) are optional and only needed for the react configs.',
    '         Similarly, typescript and typescript-eslint are optional and only needed for the TypeScript configs.',
    ''
];

console.log(lines.join('\n'));
