/* eslint no-undef: 0 */
const PredictionMarket = artifacts.require('../contracts/PredictionMarket.sol')
const WagerToken = artifacts.require('../contracts/WagerToken.sol')
const OracleFactory = artifacts.require('../contracts/OracleFactory.sol')
const WagerFactory = artifacts.require('../contracts/WagerFactory.sol')

module.exports = (deployer, network, accounts) => {
  const admin = accounts[0]

  let oracleFactory
  let predictionMarket
  let wagerFactory
  let wagerToken

  deployer.deploy(WagerToken, { from: admin })
    .then(() => WagerToken.deployed())
    .then((_instance) => { wagerToken = _instance })
    .then(() => deployer.deploy(OracleFactory, admin, wagerToken.address))
    .then(() => OracleFactory.deployed())
    .then((_instance) => { oracleFactory = _instance })
    .then(() => deployer.deploy(WagerFactory, admin, oracleFactory.address))
    .then(() => WagerFactory.deployed())
    .then((_instance) => { wagerFactory = _instance })
    .then(() => deployer.deploy(PredictionMarket, wagerToken.address, oracleFactory.address, wagerFactory.address, { from: admin }))
    .then(() => PredictionMarket.deployed())
    .then((_instance) => { predictionMarket = _instance })
    .then(() => {
      console.log('******************************************************')
      console.log(`Oracle Factory Address: ${oracleFactory.address}`)
      console.log(`Prediction Market Address: ${predictionMarket.address}`)
      console.log(`Wager Factory Address: ${wagerFactory.address}`)
      console.log(`Wager Token Address: ${wagerToken.address}`)
    })
}
