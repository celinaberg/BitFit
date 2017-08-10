const OFF = 0;
const ERROR = 2;

module.exports = {
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    "prettier",
    "import",
    "node"
  ],
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    "plugin:import/errors",
    "prettier"
  ],
  rules: {
    'prettier/prettier': ERROR,
    'no-console': OFF
  },
  overrides: [
    {
      files: [ "server/*.js"],
      env: {
        node: true
      }
    },
    {
      files: [ "*/_tests__/*.js"],
      env: {
        jest: true
      }
    }
  ]
}
