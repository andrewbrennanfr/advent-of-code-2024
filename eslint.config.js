import eslint from "@eslint/js"
import functional from "eslint-plugin-functional"
import perfectionist from "eslint-plugin-perfectionist"
import eslintPluginUnicorn from "eslint-plugin-unicorn"
import tseslint from "typescript-eslint"

export default [
    eslint.configs.all,
    ...tseslint.configs.all,
    eslintPluginUnicorn.configs["flat/all"],
    perfectionist.configs["recommended-natural"],
    functional.configs.all,
    { languageOptions: { parserOptions: { projectService: true } } },
    {
        rules: {
            "@typescript-eslint/no-magic-numbers": "off",
            "@typescript-eslint/no-shadow": "off",
            "@typescript-eslint/no-use-before-define": "off",
            "@typescript-eslint/prefer-readonly-parameter-types": "off",
            "functional/prefer-immutable-types": "off",
            "functional/type-declaration-immutability": "off",
            "max-lines": "off",
            "max-lines-per-function": "off",
            "no-ternary": "off",
            "sort-imports": "off",
            "unicorn/no-array-callback-reference": "off",
            "unicorn/no-array-reduce": "off",
            "unicorn/no-nested-ternary": "off",
            "unicorn/no-unreadable-array-destructuring": "off",
        },
    },
    {
        rules: {
            "@typescript-eslint/consistent-type-definitions": ["error", "type"],
            curly: ["error", "multi"],
            "functional/functional-parameters": [
                "error",
                { allowRestParameter: true },
            ],
            "functional/no-conditional-statements": [
                "error",
                { allowReturningBranches: true },
            ],
            "functional/prefer-tacit": "error",
            "id-length": [
                "error",
                { exceptions: ["_", "$", "c", "r", "U", "x", "y", "z"] },
            ],
            "no-restricted-syntax": [
                "error",
                {
                    message: "Modifying a Set or Map is not allowed.",
                    selector: `CallExpression[callee.property.name=/^(${[
                        "add",
                        "clear",
                        "delete",
                        "set",
                    ].join("|")})$/][callee.object.type='Identifier']`,
                },
            ],
            "one-var": ["error", "never"],
        },
    },
    {
        files: ["eslint.config.js"],
        rules: { "@typescript-eslint/naming-convention": "off" },
    },
    {
        files: ["**/*.spec.ts"],
        rules: {
            "functional/functional-parameters": "off",
            "functional/no-expression-statements": "off",
            "functional/no-return-void": "off",
        },
    },
]
