module.exports = {
  root: true,
  env: {
    "browser": true,
    "es6": true,
    "node": true
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
    // "plugin:@typescript-eslint/eslint-recommended",
    // "plugin:@typescript-eslint/recommended",
    // "plugin:import/recommended",
    // "plugin:import/electron",
    // "plugin:import/typescript"
  ],
  // "parser": "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/ban-types": ["error",
      {
        "types": {
          "String": false,
          "Boolean": false,
          "Number": false,
          "Symbol": false,
          "{}": false,
          "Object": false,
          "object": false,
          "Function": false,
        },
        "extendDefaults": true
      }
    ]
  },
};
