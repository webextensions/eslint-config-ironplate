# eslint-config-ironplate
Shareable ESLint configuration

## Installation
`$ npm install --save-dev eslint-config-ironplate`

When you run this installation command, you will also see a guide about installing peerDependencies.

## Example usages
In `.eslintrc` file, use it like one of the following combinations:
```json
{
    "extends": [ "eslint-config-ironplate" ]
}

OR

{
    "extends": [ "eslint-config-ironplate/node.js" ]
}

OR

{
    "extends": [ "eslint-config-ironplate/react.js" ]
}

OR

{
    "extends": [ "eslint-config-ironplate/typescript.js" ],
    "parser": "@typescript-eslint/parser"
}

OR

{
    "extends": [ "eslint-config-ironplate/node-typescript.js" ],
    "parser": "@typescript-eslint/parser"
}

OR

{
    "extends": [ "eslint-config-ironplate/react-typescript.js" ],
    "parser": "@typescript-eslint/parser"
}


```
