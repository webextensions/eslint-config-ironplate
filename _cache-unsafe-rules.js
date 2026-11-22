// The rules of these configs whose result can change without the linted file changing, since they read inputs from
// outside the linted file (other files, package.json, installed packages). `eslint --cache` keys a file's cached result
// on the file's content and the config only, so for these rules it can return stale results (in both directions:
// cached errors and cached passes). Exported from index.js as `cacheUnsafeRules`, eg: for running these rules without
// the cache, and the rest with it.
//
// Groups:
//     * always:              Unsafe for every project
//     * unlessSettingPinned: Unsafe unless the project pins the setting named by the key (via `settings` in its ESLint
//                            config), since otherwise the rule reads the value from outside the linted file
//
// Each entry was checked against the rule's source (rule IDs sorted within each group). test/cache-unsafe-rules.test.js
// checks that every listed rule is configured (not "off") in at least one config, so that renamed or removed rules
// don't linger here; rules added by plugin upgrades (visible in the rules-snapshot diff) need a manual check.
//
// Deliberately not listed (cacheable in practice; their result changes without the file changing only in contrived
// cases):
//     * "import-x/no-duplicates": uses the resolver only to compare the resolved paths of two imports in the same file
//     * "react-hooks/*": the React Compiler analysis checks whether "react-native-reanimated" is installed (relevant
//       for React Native projects only)
//     * "unicorn/filename-case": uses the current working directory to compute the relative file path

const cacheUnsafeRules = Object.freeze({
    always: Object.freeze([
        'import-x/default', // Reads the imported module (export map) to check it has a default export
        'import-x/export', // Follows "export * from" re-exports into the target modules
        // Resolves the import target to tell packages from local files; stale cached results were seen in practice
        // after switching between branches with different installed packages
        'import-x/extensions',
        'import-x/named', // Reads the imported module (export map) to check the named exports exist
        'import-x/namespace', // Reads the imported module (export map) to check namespace member access
        'import-x/no-extraneous-dependencies', // Reads the closest package.json (its dependency lists)
        'import-x/no-named-as-default', // Reads the imported module's export names
        'import-x/no-named-as-default-member', // Reads the imported module's export names
        'import-x/no-unresolved', // Resolves the import target (files, package.json "imports" aliases, node_modules)
        'n/no-missing-require', // Resolves require() targets
        'unicorn/expiring-todo-comments', // Reads package.json (dependencies, version, engines); with its "checkDates" option on (off here), also the date
        'unicorn/no-unnecessary-polyfills' // Reads package.json "engines" or the Browserslist config, unless its "targets" option is set (not set here)
    ]),

    unlessSettingPinned: Object.freeze({
        // `settings: { n: { version: '>=24.2.0' } }`: otherwise, read from package.json "engines.node" (or
        // "devEngines.runtime")
        'n.version': Object.freeze([
            'n/no-deprecated-api',
            'n/no-unsupported-features/es-builtins',
            'n/no-unsupported-features/es-syntax',
            'n/no-unsupported-features/node-builtins'
        ]),

        // `settings: { 'react-x': { version: '19.2.0' } }`: otherwise ("detect"), read from the installed "react"
        // package. These rules only report for React versions at or above a threshold (React 18 for "dom-no-hydrate"
        // and "dom-no-render", React 19 for the others). The React configs pin it to the installed version (see
        // resolveReactVersion() in _react.js), so it stays 'detect' only when "react" doesn't resolve from the
        // working directory.
        'react-x.version': Object.freeze([
            '@eslint-react/dom-no-hydrate',
            '@eslint-react/dom-no-render',
            '@eslint-react/dom-no-use-form-state',
            '@eslint-react/no-context-provider',
            '@eslint-react/no-forward-ref',
            '@eslint-react/no-use-context'
        ])
    })
});

export { cacheUnsafeRules };
