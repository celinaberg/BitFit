const OFF = 0;
const ERROR = 2;

module.exports = {
  parser: "babel-eslint",
  plugins: [
    "prettier",
    "import"
  ],
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "prettier",
    "prettier/flowtype"
  ],
  rules: {
    'prettier/prettier': ERROR,
    'no-console': OFF
  },
  overrides: [
    {
      files: ["*.js", "server/**/*.js"],
      plugins: [
        "node"
      ],
      env: {
        node: true
      }
    },
    {
      files: [ "react-client/**/*.js"],
      env: {
        browser: true
      }
    },
    {
      files: [ "**/_tests__/**.js"],
      env: {
        jest: true
      }
    }
  ]
}
