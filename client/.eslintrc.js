module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    extends: [
        'airbnb-typescript',
        'airbnb/hooks',
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/recommended',
        'prettier',
        'prettier/react',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    env: {
        browser: true,
        jest: true,
        es6: true
    },
    plugins: ['react', 'jest', '@typescript-eslint', 'prettier'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports,
        project: './tsconfig.json',
    },
    rules: {
        "no-console": "off",
        "no-param-reassign": [2, { "props": false }],
        "no-plusplus": "off",
        "no-restricted-syntax": ["error", "ForInStatement", /*ForOfStatement, */ "LabeledStatement", "WithStatement"],
        "react/prop-types": "off", // Doesn't play well with arrow functions https://github.com/yannickcr/eslint-plugin-react/issues/2353
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