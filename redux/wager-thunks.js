/* eslint no-unused-vars: 0 */
import web3 from '../lib/web3'
import {
  getWager,
  getWagerFactory,
} from '../ethereum/contracts'
import {
  bigNumToString,
  bigNumToEther,
  etherToWei,
  getDefaultAccount,
  parseOutcomeData,
} from './helpers'
import { setWagerData } from './actions'
import { handleError } from './thunks'

export const createWager = ({
  title,
  description,
  lockTimestamp,
  minimumBet,
  maximumPot,
  outcome1,
  outcome2,
}) => async (dispatch) => {
  try {
    const account = await getDefaultAccount()
    const WagerFactory = await getWagerFactory()
    await WagerFactory.createWager(
      title,
      description,
      lockTimestamp,
      web3.utils.toWei(minimumBet, 'ether'),
      web3.utils.toWei(maximumPot, 'ether'),
      outcome1,
      outcome2,
      { from: account },
    )
  } catch (err) {
    console.error('createWager', err)
  }
}

export const getWagerSummary = ({ address }) => async (dispatch) => {
  try {
    const wager = await getWager(address)
    const account = await getDefaultAccount()

    const promises = [
      wager.ceoAddress(),
      wager.oracleFactoryAddress(),
      wager.creatorAddress(),
      wager.oracleAddress(),

      wager.title(),
      wager.description(),
      wager.lockTimestamp(),
      wager.minimumBet(),
      wager.maximumPot(),
      wager.getOutcomeData(1, { from: account }),
      wager.getOutcomeData(2, { from: account }),

      wager.winnerIndex(),
      wager.totalPot(),
      // wager.totalPlayers(),
      wager.getStage(),
      web3.eth.getBalance(address),
    ]

    Promise.all(promises).then((values) => {
      const [
        ceoAddress,
        oracleFactoryAddress,
        creatorAddress,
        oracleAddress,

        title,
        description,
        lockTimestamp,
        minimumBet,
        maximumPot,

        outcome1,
        outcome2,

        winnerIndex,
        totalPot,
        stage,
        remainingBalance,
      ] = values
      const data = {
        address, // wager address
        ceoAddress,
        oracleFactoryAddress,
        creatorAddress,
        oracleAddress,

        title,
        description,
        lockTimestamp: bigNumToString(lockTimestamp),
        minimumBet: bigNumToEther(minimumBet),
        maximumPot: bigNumToEther(maximumPot),
        outcome1: parseOutcomeData(outcome1),
        outcome2: parseOutcomeData(outcome2),

        winnerIndex: bigNumToString(winnerIndex),
        totalPot: bigNumToEther(totalPot),
        stage,
        remainingBalance: bigNumToEther(remainingBalance),
      }
      dispatch(setWagerData({ address, data }))
    })
  } catch (err) {
    console.error('getWager: ', err)
  }
}

export const getDeployedWagers = () => async (dispatch) => {
  try {
    const WagerFactory = await getWagerFactory()
    const addresses = await WagerFactory.getDeployedWagers()
    addresses.forEach(address => dispatch(getWagerSummary({ address })))
  } catch (err) {
    console.error('getDeployedWagers', err)
  }
}

export const editWager = ({ address, title, description }) => async (dispatch) => {
  try {
    if (!title && !description) throw Error('Nothing to edit.')
    const account = await getDefaultAccount()
    const wager = await getWager(address)
    if (title) {
      await wager.setTitle(title, { from: account })
    }
    if (description) {
      await wager.setDescription(description, { from: account })
    }
    dispatch(getWagerSummary({ address }))
  } catch (err) {
    console.error('editWager', err)
  }
}

export const approveWager = ({ address }) => async (dispatch) => {
  try {
    const account = await getDefaultAccount()
    const wager = await getWager(address)
    await wager.approveWager({ from: account })
    dispatch(getWagerSummary({ address }))
  } catch (err) {
    console.error('approveWager', err)
  }
}

export const closeWager = ({ address }) => async (dispatch) => {
  try {
    const account = await getDefaultAccount()
    const wager = await getWager(address)
    await wager.closeWager({ from: account })
    dispatch(getWagerSummary({ address }))
  } catch (err) {
    console.error('closeWager', err)
  }
}

export const setWinnerIndex = ({ address, winnerIndex }) => async (dispatch) => {
  try {
    const account = await getDefaultAccount()
    const wager = await getWager(address)
    await wager.setWinnerIndex(winnerIndex, { from: account })
  } catch (err) {
    console.error('setWinnerIndex', err)
  }
}

export const createMatchingOracle = ({ address }) => async (dispatch) => {
  try {
    const account = await getDefaultAccount()
    const wager = await getWager(address)
    await wager.createMatchingOracle({ from: account })
    dispatch(getWagerSummary({ address }))
  } catch (err) {
    console.error('createMatchingOracle', err)
  }
}

export const checkForWinner = ({ address }) => async (dispatch) => {
  try {
    const account = await getDefaultAccount()
    const wager = await getWager(address)
    await wager.checkForWinner({ from: account })
    dispatch(getWagerSummary({ address }))
  } catch (err) {
    console.error('checkForWinner', err)
  }
}

export const withdrawWinnings = ({ address }) => async (dispatch) => {
  try {
    const account = await getDefaultAccount()
    const wager = await getWager(address)
    await wager.withdrawWinnings({ from: account })
    dispatch(getWagerSummary({ address }))
  } catch (err) {
    console.error('withdrawWinnings', err)
  }
}

export const refundBets = ({ address }) => async (dispatch) => {
  try {
    const account = await getDefaultAccount()
    const wager = await getWager(address)
    await wager.refundBets({ from: account })
    dispatch(getWagerSummary({ address }))
  } catch (err) {
    console.error('refundBets', err)
  }
}

export const placeBet = ({ address, bet, outcomeIndex }) => async (dispatch) => {
  try {
    if (outcomeIndex !== 1 && outcomeIndex !== 2) throw Error('Invalid outcome selected.')
    if (!bet) throw Error('Invalid bet. Please enter a number greater than 0.')
    if (!address) throw Error('No address.')
    const account = await getDefaultAccount()
    const wager = await getWager(address)
    await wager.placeBet(outcomeIndex, { from: account, value: etherToWei(bet) })
    dispatch(getWagerSummary({ address }))
  } catch (err) {
    console.error('placeBet', err)
    dispatch(handleError(err))
  }
}

