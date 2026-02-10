import nx from "@nx/eslint-plugin";
import baseConfig from "../../eslint.config.mjs";

export default [
    ...baseConfig,
    ...nx.configs["flat/react"],
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.js",
            "**/*.jsx"
        ],
        rules: {
            // Downgrade noisy pre-existing errors to warnings
            "@typescript-eslint/no-inferrable-types": "warn",
            "@typescript-eslint/no-empty-function": "warn"
        }
    },
    // ngx-charts library: BaseChart render-prop pattern calls hooks inside callbacks
    {
        files: ["**/lib/ngx-charts/**/*.ts", "**/lib/ngx-charts/**/*.tsx"],
        rules: {
            "react-hooks/rules-of-hooks": "warn",
            "import/first": "warn",
            "prefer-spread": "warn"
        }
    }
];
