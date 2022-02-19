/* eslint no-undef: 0 max-len: 0 */

const assert = require('assert')

const Wager = artifacts.require('Wager')

const TITLE = 'Who will win the 2016 US presidential election?'
const DESCRIPTION = 'Hillary Clinton or Donald Trump'
const LOCK_TIMESTAMP = 1529789955
const MINIMUM_WEI = 1000
const MAXIMUM_POT = 1000000000
const OUTCOME_1 = 'Clinton'
const OUTCOME_2 = 'Trump'

const isVmException = err => err.toString().includes('VM Exception')

contract('Wager', (accounts) => {
  let wagerContract

  beforeEach('initializes Wager contract', async () => {
    wagerContract = await Wager.new(
      accounts[0],
      accounts[9],
      accounts[0],
      TITLE,
      DESCRIPTION,
      LOCK_TIMESTAMP,
      MINIMUM_WEI,
      MAXIMUM_POT,
      OUTCOME_1,
      OUTCOME_2,
    )
  })

  // verifies that Wager instances are initialized with correct values
  it('constructor', async () => {
    assert.equal(await wagerContract.title(), TITLE)
    assert.equal(await wagerContract.description(), DESCRIPTION)
    assert.equal(await wagerContract.lockTimestamp(), LOCK_TIMESTAMP)
    assert.equal(await wagerContract.minimumBet(), MINIMUM_WEI)
    // assert.equal(await wagerContract.outcome1(), OUTCOME_1)
    // assert.equal(await wagerContract.outcome2(), OUTCOME_2)
  })

  // verifies that Wager instances can only be APPROVED by the admin
  it('approveWager', async () => {
    try {
      await wagerContract.approveWager({ from: accounts[1] })
      assert.fail()
    } catch (err) {
      assert.ok(isVmException(err))
    }
    await wagerContract.approveWager({ from: accounts[0] })
  })

  // verifies that Wager instances cannot receive bets before being APPROVED
  it('placeBet - throws if not approved', async () => {
    try {
      await wagerContract.placeBet(0, { from: accounts[1], value: 10000 })
      assert.fail()
    } catch (err) {
      assert.ok(isVmException(err))
    }
  })

  // verifies that Wager instances reject bets lower than minimumBet set by Wager creator
  it('placeBet - throws if value too low', async () => {
    await wagerContract.approveWager()
    try {
      await wagerContract.placeBet(0, { from: accounts[1], value: 999 })
      assert.fail()
    } catch (err) {
      assert.ok(isVmException(err))
    }
  })

  // verifies that Wager instances reject bets on invalid outcome indices
  it('placeBet - throws if outcome does not exist', async () => {
    await wagerContract.approveWager()
    try {
      await wagerContract.placeBet(3, { from: accounts[1], value: 10000 })
      assert.fail()
    } catch (err) {
      assert.ok(isVmException(err))
    }
  })

  // verifies that placeBet functions as expected.
  it('placeBet', async () => {
    let players
    let text
    let pot
    let balance

    assert.equal(await web3.eth.getBalance(wagerContract.address), 0)
    await wagerContract.approveWager()

    await wagerContract.placeBet(1, { from: accounts[2], value: 1100 })
    assert.equal(await web3.eth.getBalance(wagerContract.address), 1100);
    [text, players, pot, balance] = await wagerContract.getOutcomeData(1, { from: accounts[2] })
    assert.equal(players, 1)
    assert.equal(text, OUTCOME_1)
    assert.equal(pot, 1100)
    assert.equal(balance, 1100)

    await wagerContract.placeBet(1, { from: accounts[2], value: 1000 })
    assert.equal(await web3.eth.getBalance(wagerContract.address), 2100);
    [text, players, pot, balance] = await wagerContract.getOutcomeData(1, { from: accounts[2] })
    assert.equal(players, 1)
    assert.equal(text, OUTCOME_1)
    assert.equal(pot, 2100)
    assert.equal(balance, 2100)

    await wagerContract.placeBet(1, { from: accounts[1], value: 4000 })
    assert.equal(await web3.eth.getBalance(wagerContract.address), 6100);
    [text, players, pot, balance] = await wagerContract.getOutcomeData(1, { from: accounts[1] })
    assert.equal(players, 2)
    assert.equal(text, OUTCOME_1)
    assert.equal(pot, 6100)
    assert.equal(balance, 4000)

    await wagerContract.placeBet(2, { from: accounts[3], value: 5000 })
    assert.equal(await web3.eth.getBalance(wagerContract.address), 11100);
    [text, players, pot, balance] = await wagerContract.getOutcomeData(2, { from: accounts[3] })
    assert.equal(players, 1)
    assert.equal(text, OUTCOME_2)
    assert.equal(pot, 5000)
    assert.equal(balance, 5000);

    [text, players, pot, balance] = await wagerContract.getOutcomeData(2, { from: accounts[1] })
    assert.equal(players, 1)
    assert.equal(text, OUTCOME_2)
    assert.equal(pot, 5000)
    assert.equal(balance, 0)
  })

  // verifies that only admin can set Wager instance stage to CLOSED.
  it('closeWager', async () => {
    await wagerContract.approveWager()
    assert.equal(await wagerContract.getStage(), 'Approved')
    try {
      await wagerContract.closeWager({ from: accounts[1] })
      assert.fail()
    } catch (err) {
      assert.ok(isVmException(err))
    }
    await wagerContract.closeWager()
    assert.equal(await wagerContract.getStage(), 'Closed')
  })

  // verifies that only admin can set Wager winner index.
  it('setWinnerIndex - throws if not manager or invalid index', async () => {
    await wagerContract.approveWager()
    await wagerContract.closeWager()
    // not manager
    try {
      await wagerContract.setWinnerIndex(1, { from: accounts[1] })
      assert.fail()
    } catch (err) {
      assert.ok(isVmException(err))
    }
    // invalid index
    try {
      await wagerContract.setWinnerIndex(3, { from: accounts[0] })
      assert.fail()
    } catch (err) {
      assert.ok(isVmException(err))
    }
  })

  // verifies that setting wager index changes stage to CANCELLED if there are no bets.
  it('setWinnerIndex - cancelled', async () => {
    await wagerContract.approveWager()
    await wagerContract.closeWager()
    await wagerContract.setWinnerIndex(1)
    assert.equal(await wagerContract.getStage(), 'Cancelled')
  })

  // verifies that setting wager index changes stage to RESOLVED if there are correct bets.
  it('setWinnerIndex - resolved', async () => {
    await wagerContract.approveWager()
    await wagerContract.placeBet(1, { from: accounts[1], value: 5000 })
    await wagerContract.closeWager()
    await wagerContract.setWinnerIndex(1)
    assert.equal(await wagerContract.getStage(), 'Resolved')
  })
})
