const OFF = 0;
const ERROR = 2;

module.exports = {
  root: true,
  parser: "babel-eslint",
  plugins: [
    "node",
    "import",
    "react",
    "flowtype",
    "prettier",
  ],
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:flowtype/recommended",
    "plugin:react/recommended",
    "prettier",
    "prettier/flowtype"
  ],
  rules: {
    'prettier/prettier': ERROR,
    'no-console': OFF,
    'import/no-commonjs': ERROR
  },
  overrides: [
    {
      files: ["*.js", "server/**/*"],
      env: {
        node: true
      }
    },
    {
      files: [ "react-client/**/*"],
      env: {
        browser: true
      }
    },
    {
      files: [ "**/__tests__/**", "**.test.js"],
      env: {
        jest: true
      }
    },
    {
      files: ["webpack.config.js", "ecosystem.config.js"],
      rules: {
        "import/unambiguous": OFF,
        "import/no-commonjs": OFF
      }
    },
  ]
}
