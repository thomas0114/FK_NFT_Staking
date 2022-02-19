/* eslint no-undef: 0 */
const Migrations = artifacts.require('Migrations')

module.exports = (deployer, network, accounts) => {
  deployer.deploy(Migrations, { from: accounts[0] })
}
