import eslint from "@eslint/js"
import perfectionist from "eslint-plugin-perfectionist"
import tseslint from "typescript-eslint"

export default [
    eslint.configs.all,
    ...tseslint.configs.all,
    perfectionist.configs["recommended-natural"],
    {
        rules: {
            "@typescript-eslint/prefer-readonly-parameter-types": "off",
            curly: "off",
            "no-ternary": "off",
            "sort-imports": "off",
        },
    },
    {
        rules: {
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    filter: "[-]",
                    format: [],
                    selector: "property",
                },
                {
                    format: ["camelCase"],
                    leadingUnderscore: "allow",
                    selector: "default",
                },
                {
                    format: ["camelCase", "PascalCase"],
                    selector: "import",
                },
                {
                    format: ["PascalCase"],
                    selector: "typeLike",
                },
            ],
            "one-var": ["error", "never"],
        },
    },
    {
        rules: {
            "no-restricted-syntax": [
                "error",
                {
                    message: "Do not use any non-functional patterns.",
                    selector: [
                        "ClassDeclaration",
                        "VariableDeclaration[kind!='const']",

                        "AssignmentExpression",
                        "ThisExpression",
                        "UnaryExpression[operator='delete']",
                        "UpdateExpression",

                        "CatchClause",
                        "DoWhileStatement",
                        "ForInStatement",
                        "ForOfStatement",
                        "ForStatement",
                        "IfStatement[alternate]",
                        "SwitchStatement",
                        "ThrowStatement",
                        "TryStatement",
                        "WhileStatement",

                        "CallExpression[callee.property.name='copyWithin']",
                        "CallExpression[callee.property.name='fill']",
                        "CallExpression[callee.property.name='pop']",
                        "CallExpression[callee.property.name='push']",
                        "CallExpression[callee.property.name='reverse']",
                        "CallExpression[callee.property.name='shift']",
                        "CallExpression[callee.property.name='sort']",
                        "CallExpression[callee.property.name='splice']",
                        "CallExpression[callee.property.name='unshift']",

                        "CallExpression[callee.property.name='assign']",
                        "CallExpression[callee.property.name='defineProperties']",
                        "CallExpression[callee.property.name='defineProperty']",
                        "CallExpression[callee.property.name='freeze']",
                        "CallExpression[callee.property.name='seal']",
                        "CallExpression[callee.property.name='setPrototypeOf']",

                        "CallExpression[callee.property.name='add']",
                        "CallExpression[callee.property.name='clear']",
                        "CallExpression[callee.property.name='delete']",
                        "CallExpression[callee.property.name='set']",
                    ].join(","),
                },
            ],
        },
    },
    {
        files: ["**/*.spec.ts"],
        rules: {
            "@typescript-eslint/no-magic-numbers": "off",
            "max-lines-per-function": "off",
        },
    },
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
    },
]
