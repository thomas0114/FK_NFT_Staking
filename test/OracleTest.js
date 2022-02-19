/* eslint no-undef: 0 max-len: 0 */

const assert = require('assert')
const BigNumber = require('bignumber.js')

const WagerToken = artifacts.require('WagerToken')
const Oracle = artifacts.require('Oracle')

const isVmException = err => err.toString().includes('VM Exception')

contract('Oracle', (accounts) => {
  let wagerTokenContract
  let oracleContract

  beforeEach('initializes Wager contract', async () => {
    wagerTokenContract = await WagerToken.new()
    await wagerTokenContract.transfer(accounts[1], 10)
    await wagerTokenContract.transfer(accounts[2], 20)
    await wagerTokenContract.transfer(accounts[3], 30)
    oracleContract = await Oracle.new(
      accounts[0],
      wagerTokenContract.address,
      accounts[9],
      'heads',
      'tails',
    )
  })

  // verifies that Oracle instances are initialized with correct values, 0
  it('constructor', async () => {
    assert.equal(await oracleContract.ceoAddress(), accounts[0])
    assert.equal(await oracleContract.tokenAddress(), wagerTokenContract.address)
    assert.equal(await oracleContract.wagerAddress(), accounts[9])
    assert.deepEqual(await oracleContract.winnerIndex(), new BigNumber(0))
    assert.equal(await oracleContract.getStage(), 'Opened')
    await oracleContract.getOutcomeData(0)
    assert.deepEqual(await oracleContract.getOutcomeData(1), ['heads', new BigNumber(0), new BigNumber(0)])
    assert.deepEqual(await oracleContract.getOutcomeData(2), ['tails', new BigNumber(0), new BigNumber(0)])
  })

  // verifies that closeVoting switches the Stage of Oracle instance to "Closed"
  it('closeVoting', async () => {
    await oracleContract.closeVoting()
    assert.equal(await oracleContract.getStage(), 'Closed')
  })

  // verifies that determineWinnerIndex selects the index value with more votes
  it('determineWinnerIndex', async () => {
    wagerTokenContract.approve(oracleContract.address, 1, { from: accounts[1] })
    assert.deepEqual(await wagerTokenContract.balanceOf(accounts[1]), new BigNumber(10))
    await oracleContract.vote(1, 1, { from: accounts[1] })
    wagerTokenContract.approve(oracleContract.address, 1, { from: accounts[2] })
    assert.deepEqual(await wagerTokenContract.balanceOf(accounts[2]), new BigNumber(20))
    await oracleContract.vote(2, 1, { from: accounts[2] })
    await oracleContract.determineWinnerIndex()
    assert.equal(await oracleContract.getStage(), 'Tied')
  })

  // verifies that refundTokens returns back all tokens if there is a Tie
  it('refundTokens', async () => {
    wagerTokenContract.approve(oracleContract.address, 1, { from: accounts[1] })
    assert.deepEqual(await wagerTokenContract.balanceOf(accounts[1]), new BigNumber(10))
    await oracleContract.vote(1, 1, { from: accounts[1] })
    wagerTokenContract.approve(oracleContract.address, 1, { from: accounts[2] })
    assert.deepEqual(await wagerTokenContract.balanceOf(accounts[2]), new BigNumber(20))
    await oracleContract.vote(2, 1, { from: accounts[2] })
    await oracleContract.determineWinnerIndex()
    assert.equal(await oracleContract.getStage(), 'Tied')
    assert.deepEqual(await wagerTokenContract.balanceOf(accounts[1]), new BigNumber(9))
    await oracleContract.refundTokens({ from: accounts[1] })
    assert.deepEqual(await wagerTokenContract.balanceOf(accounts[1]), new BigNumber(10))
  })

  // verifies that voting mechanics work as expected (winner is always majority)
  it('vote', async () => {
    wagerTokenContract.approve(oracleContract.address, 1, { from: accounts[1] })
    assert.deepEqual(await wagerTokenContract.balanceOf(accounts[1]), new BigNumber(10))
    await oracleContract.vote(1, 1, { from: accounts[1] })
    assert.deepEqual(await oracleContract.getOutcomeData(1, { from: accounts[1] }), ['heads', new BigNumber(1), new BigNumber(1)])
    // assert.equal(await oracleContract.totalVotes(), 1)
    assert.deepEqual(await wagerTokenContract.balanceOf(accounts[1]), new BigNumber(9))

    wagerTokenContract.approve(oracleContract.address, 20, { from: accounts[2] })
    assert.deepEqual(await wagerTokenContract.balanceOf(accounts[2]), new BigNumber(20))
    await oracleContract.vote(2, 20, { from: accounts[2] })
    assert.deepEqual(await oracleContract.getOutcomeData(2, { from: accounts[2] }), ['tails', new BigNumber(20), new BigNumber(20)])
    // assert.equal(await oracleContract.totalVotes(), 21)
    assert.deepEqual(await wagerTokenContract.balanceOf(accounts[2]), new BigNumber(0))

    wagerTokenContract.approve(oracleContract.address, 30, { from: accounts[3] })
    assert.deepEqual(await wagerTokenContract.balanceOf(accounts[3]), new BigNumber(30))
    await oracleContract.vote(1, 30, { from: accounts[3] })
    assert.deepEqual(await oracleContract.getOutcomeData(1, { from: accounts[3] }), ['heads', new BigNumber(31), new BigNumber(30)])
    // assert.equal(await oracleContract.totalVotes(), 51)
    assert.deepEqual(await wagerTokenContract.balanceOf(accounts[3]), new BigNumber(0))

    try {
      await oracleContract.getWinnerIndex()
      assert.fail()
    } catch (err) {
      assert.ok(isVmException(err))
    }

    await oracleContract.determineWinnerIndex()
    assert.equal(await oracleContract.getWinnerIndex(), 1)

    assert.deepEqual(await wagerTokenContract.balanceOf(accounts[1]), new BigNumber(9))
    await oracleContract.withdrawTokens({ from: accounts[1] })
    assert.deepEqual(await wagerTokenContract.balanceOf(accounts[1]), new BigNumber(10))

    assert.deepEqual(await wagerTokenContract.balanceOf(accounts[3]), new BigNumber(0))
    await oracleContract.withdrawTokens({ from: accounts[3] })
    assert.deepEqual(await wagerTokenContract.balanceOf(accounts[3]), new BigNumber(30))

    assert.deepEqual(await wagerTokenContract.balanceOf(accounts[2]), new BigNumber(0))
    await oracleContract.withdrawTokens({ from: accounts[2] })
    assert.deepEqual(await wagerTokenContract.balanceOf(accounts[2]), new BigNumber(0))

    assert.deepEqual(await wagerTokenContract.balanceOf(oracleContract.address), new BigNumber(20))
    assert.deepEqual(await wagerTokenContract.balanceOf(accounts[0]), new BigNumber(40))
    await oracleContract.withdrawBadVotes()
    assert.deepEqual(await wagerTokenContract.balanceOf(oracleContract.address), new BigNumber(0))
    assert.deepEqual(await wagerTokenContract.balanceOf(accounts[0]), new BigNumber(60))
  })
})
