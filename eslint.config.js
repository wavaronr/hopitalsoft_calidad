import globals from "globals";

export default [
  // ========================================
  // Configuración general del proyecto
  // ========================================
  {
    files: ["**/*.js"],

    ignores: [
      "node_modules/**",
      "coverage/**",
    ],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        ...globals.node,
      },
    },

    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "eqeqeq": "error",
      "no-console": "off",
    },
  },

  // ========================================
  // Configuración específica para Jest
  // ========================================
  {
    files: [
      "tests/**/*.js",
      "**/*.test.js",
    ],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
];