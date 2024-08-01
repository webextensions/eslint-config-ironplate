# TODO

## Migrate to ESLint's Flat Config system
Among the peer dependencies, their compatibility with ESLint's Flat Config system is as follows:

```
"@stylistic/eslint-plugin"         // ✔ Supports new ESLint
"@typescript-eslint/eslint-plugin" // ✔ Supports new ESLint
"eslint-plugin-filenames"          // ? Inactive since many years
                                   //   No response at issue about asking for support: https://github.com/selaux/eslint-plugin-filenames/issues/54
                                   //   Can try switching to https://github.com/kavsingh/eslint-plugin-filenames/tree/eslint-9
"eslint-plugin-import"             // ? Support should be available soon
                                   //   Follow https://github.com/import-js/eslint-plugin-import/issues/2948
                                   //   Note: Alternative suggested there https://www.npmjs.com/package/eslint-plugin-import-x but it is not popular enough yet
"eslint-plugin-node"               // ✔ Switch to https://www.npmjs.com/package/eslint-plugin-n (https://github.com/mysticatea/eslint-plugin-node/issues/358#issuecomment-2049254668)
"eslint-plugin-react"              // ✔ Supports new ESLint
"eslint-plugin-react-hooks"        // ? Support will be available soon, probably with release of React 19 (https://github.com/facebook/react/issues/28313#issuecomment-2076798972)
"eslint-plugin-unicorn"            // ✔ Supports new ESLint
```

**References:**
* https://eslint.org/docs/latest/extend/plugin-migration-flat-config
