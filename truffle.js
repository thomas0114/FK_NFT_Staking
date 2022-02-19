const HDWalletProvider = require('truffle-hdwallet-provider')
require('dotenv').config()

const ROPSTEN_URL = `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`
const RINKEBY_URL = `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  compilers: {
    solc: {
      version: '0.4.25',
      // optimizer: {
      //   enabled: true,
      //   runs: 200,
      // },
    },
  },
  networks: {
    development: {
      // default address to use for any transaction Truffle makes during migrations
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 4700000,
      gasPrice: 20e9,
    },
    ropsten: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, ROPSTEN_URL),
      network_id: 3,
      gas: 4700000,
      gasPrice: 100000000000,
    },
    rinkeby: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, RINKEBY_URL),
      network_id: 4,
      gas: 4700000,
      gasPrice: 100000000000,
    },

  },
}
