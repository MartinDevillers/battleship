module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    extends: [
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    env: {
        node: true,
        es6: true
    },
    plugins: ['@typescript-eslint', 'prettier'],
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports,
        project: './tsconfig.json',
    },
    rules: {
        "no-console": "off",
        "no-param-reassign": [2, { "props": false }],
        "no-plusplus": "off",
        "prettier/prettier": [
            "error",
            {
                trailingComma: "es5",
                semi: false,
                singleQuote: false,
                printWidth: 120,
                endOfLine: "auto"
            }
        ]
    }
};