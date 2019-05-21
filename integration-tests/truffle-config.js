require("babel-register");
require("babel-polyfill");

module.exports = {
  contracts_directory: "../src",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      timeoutBlocks: 100,
      network_id: "*" // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "^0.4.24", // A version or constraint - Ex. "^0.4.24"
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  mocha: {
    enableTimeouts: false
  }
};
