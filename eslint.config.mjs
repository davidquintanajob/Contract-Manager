import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  // Configuración específica para tests con Jest
  {
    files: ["tests/**/*.js"],
    env: { jest: true, node: true },
    languageOptions: { sourceType: "commonjs" }
  },
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
];