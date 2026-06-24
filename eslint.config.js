import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  {
    ignores: ["dist", "src-tauri", "node_modules", ".kilo", "eslint.config.js", "src-preact"],
  },
  {
    extends: [...tseslint.configs.recommended, ...pluginVue.configs["flat/recommended"]],
    files: ["src/**/*.ts", "src/**/*.vue"],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "vue/multi-word-component-names": "off",
    },
  },
  {
    files: ["scripts/**/*.mjs", "scripts/**/*.js"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  prettier,
);
