import nx from "@nx/eslint-plugin";

export default [
    ...nx.configs["flat/base"],
    ...nx.configs["flat/typescript"],
    ...nx.configs["flat/javascript"],
    {
      "ignores": [
        "**/dist",
        "**/out",
        "**/out-tsc",
        "**/.next",
        "**/.next-prod",
        "**/vite.config.*.timestamp*"
      ]
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.js",
            "**/*.jsx"
        ],
        rules: {
            "@nx/enforce-module-boundaries": [
                "error",
                {
                    enforceBuildableLibDependency: true,
                    allow: [
                        "^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$"
                    ],
                    depConstraints: [
                        {
                            sourceTag: "*",
                            onlyDependOnLibsWithTags: [
                                "*"
                            ]
                        }
                    ]
                }
            ]
        }
    },
    // TypeScript & JS quality rules (covers WebStorm-equivalent inspections)
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.cts",
            "**/*.mts",
            "**/*.js",
            "**/*.jsx",
            "**/*.cjs",
            "**/*.mjs"
        ],
        rules: {
            "prefer-const": "warn",
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "@typescript-eslint/no-unused-vars": ["warn", {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
                ignoreRestSiblings: true
            }],
            "@typescript-eslint/no-explicit-any": "warn"
        }
    },
    // Enforce @/ alias for imports that cross feature/module boundaries
    {
        files: [
            "apps/web/src/**/*.ts",
            "apps/web/src/**/*.tsx"
        ],
        rules: {
            "no-restricted-imports": ["warn", {
                patterns: [{
                    group: ["../../../**"],
                    message: "Use @/ alias instead of deep relative imports (3+ parent traversals)."
                }]
            }]
        }
    }
];
