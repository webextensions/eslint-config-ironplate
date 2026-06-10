# TODO

* Revisit "eslint-plugin-react" once it ships ESLint 10 support
  (https://github.com/jsx-eslint/eslint-plugin-react) (https://github.com/jsx-eslint/eslint-plugin-react/issues/3977) and decide between re-adding it or staying consolidated on
  "@eslint-react/eslint-plugin". Rules dropped for now in this package:
    * The "pluginReact.configs.flat.recommended" rule set (largely superseded by the "@eslint-react/eslint-plugin"
      recommended config; also, ESLint 10 core scope analysis now tracks JSX references itself, which covers
      "react/jsx-uses-vars")
    * "react/prop-types" (it was set to "off" anyway)
    * "react/self-closing-comp" (replaced by the equivalent "@stylistic/jsx-self-closing-comp")

* Revisit "eslint-plugin-jsx-a11y" once it ships ESLint 10 support
  (https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) (https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/1075) and re-add its recommended a11y rule set.
  Note: The main known consumer disables several "jsx-a11y/*" rules locally, so re-adding it is low-risk.
