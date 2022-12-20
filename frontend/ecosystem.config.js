module.exports = {
  name: "my-app",
  script: "node_modules\\react-scripts\\scripts\\start.js",
  node_args: "--openssl-legacy-provider",
  instances: 1,
  exec_mode: "cluster",
};
