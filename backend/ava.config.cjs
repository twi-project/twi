module.exports = {
  failFast: true,
  environmentVariables: {
    NODE_ENV: "test",
    TS_NODE_COMPILER: "ttypescript",
    TS_NODE_PROJECT: "tsconfig.json"
  },
  extensions: [
    "ts"
  ],
  files: ["**/*.test.ts"],
  require: [
    "ts-node/register",
    "reflect-metadata",
    // "./src/config.ts"
  ]
}
