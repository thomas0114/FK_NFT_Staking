import web3 from '../lib/web3'
import {
  getOracle,
  getOracleFactory,
  getWagerToken,
} from '../ethereum/contracts'
import {
  bigNumToEther,
  bigNumToString,
  getDefaultAccount,
  parseOracleOutcomeData,
} from './helpers'
import { setOracleData } from './actions'

export const getOracleSummary = ({ address }) => async (dispatch) => {
  try {
    const account = await getDefaultAccount()
    const oracle = await getOracle(address)

    const promises = [
      oracle.ceoAddress(),
      oracle.tokenAddress(),
      oracle.wagerAddress(),

      oracle.winnerIndex(),
      oracle.oraclePot(),
      oracle.getOutcomeData(1, { from: account }),
      oracle.getOutcomeData(2, { from: account }),

      oracle.getStage(),
      web3.eth.getBalance(address),
    ]

    Promise.all(promises).then((values) => {
      const [
        ceoAddress,
        tokenAddress,
        wagerAddress,

        winnerIndex,
        oraclePot,
        outcome1,
        outcome2,

        stage,
        remainingBalance,
      ] = values
      const data = {
        address, // oracle address
        ceoAddress,
        tokenAddress,
        wagerAddress,

        winnerIndex: bigNumToString(winnerIndex),
        oraclePot: bigNumToEther(oraclePot),
        outcome1: parseOracleOutcomeData(outcome1),
        outcome2: parseOracleOutcomeData(outcome2),

        stage,
        remainingBalance: bigNumToEther(remainingBalance),
      }
      dispatch(setOracleData({ address, data }))
    })
  } catch (err) {
    console.error('getWager: ', err)
  }
}

export const getDeployedOracles = () => async (dispatch) => {
  try {
    const oracleFactory = await getOracleFactory()
    const addresses = await oracleFactory.getDeployedOracles()
    addresses.forEach(address => dispatch(getOracleSummary({ address })))
  } catch (err) {
    console.error('getDeployedOracles', err)
  }
}

export const voteOnOracle = ({ address, outcomeIndex, stake }) => async (dispatch) => {
  try {
    const account = await getDefaultAccount()
    const wagerToken = await getWagerToken()
    await wagerToken.approve(address, stake, { from: account })
    const oracle = await getOracle(address)
    await oracle.vote(outcomeIndex, stake, { from: account })
    dispatch(getOracleSummary({ address }))
  } catch (err) {
    console.error('voteOnOracle', err)
  }
}

export const determineWinnerIndex = ({ address }) => async (dispatch) => {
  try {
    const account = await getDefaultAccount()
    const oracle = await getOracle(address)
    await oracle.determineWinnerIndex({ from: account })
    dispatch(getOracleSummary({ address }))
  } catch (err) {
    console.error('determineWinnerIndex', err)
  }
}

export const withdrawTokens = ({ address }) => async (dispatch) => {
  try {
    const account = await getDefaultAccount()
    const oracle = await getOracle(address)
    await oracle.withdrawTokens({ from: account })
    dispatch(getOracleSummary({ address }))
  } catch (err) {
    console.error('withdrawTokens', err)
  }
}

export const withdrawBadVotes = ({ address }) => async (dispatch) => {
  try {
    const account = await getDefaultAccount()
    const oracle = await getOracle(address)
    await oracle.withdrawBadVotes({ from: account })
    dispatch(getOracleSummary({ address }))
  } catch (err) {
    console.error('withdrawBadVotes', err)
  }
}
