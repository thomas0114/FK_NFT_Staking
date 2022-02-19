/* eslint no-unused-vars: 0 */
import { getWagerToken } from '../ethereum/contracts'
import {
  bigNumToString,
  getDefaultAccount,
} from './helpers'
import { setUserTokenBalance } from './actions'

/**
 * Get token total supply.
 * @returns {string}
 */
export const getTokenTotalSupply = () => async (dispatch) => {
  try {
    const wagerToken = await getWagerToken()
    const totalSupply = await wagerToken.totalSupply()
    console.log('totalSupply:', bigNumToString(totalSupply))
    return bigNumToString(totalSupply)
  } catch (err) {
    console.error('getTokenTotalSupply', err)
    return null
  }
}

/**
 * Get token balance of msg.sender.
 * @returns {string}
 */
export const getTokenBalanceOf = () => async (dispatch) => {
  try {
    const account = await getDefaultAccount()
    const wagerToken = await getWagerToken()
    const balance = await wagerToken.balanceOf(account)
    dispatch(setUserTokenBalance(bigNumToString(balance)))
    return bigNumToString(balance)
  } catch (err) {
    console.error('getTokenBalanceOf', err)
    return null
  }
}

/**
 * Transfer tokens to address.
 * @param {object} tx
 * @param {string} tx.to
 * @param {string} tx.value
 */
export const transferToken = ({ to, value }) => async (dispatch) => {
  try {
    const account = await getDefaultAccount()
    const wagerToken = await getWagerToken()
    await wagerToken.transfer(to, value, { from: account, gasPrice: 20e9 })
  } catch (err) {
    console.error('transferToken', err)
  }
}

/**
 * Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
 * @param {object} tx
 * @param {string} tx.spender
 * @param {string} tx.value
 */
export const approveToken = ({ spender, value }) => async (dispatch) => {
  try {
    const account = await getDefaultAccount()
    const wagerToken = await getWagerToken()
    await wagerToken.approve(spender, value, { from: account })
  } catch (err) {
    console.error('voteOnOracle', err)
  }
}

/**
 * Transfer tokens from one address to another.
 * @param {object} tx
 * @param {string} tx.from
 * @param {string} tx.to
 * @param {string} tx.value
 */
export const transferFromToken = ({ from, to, value }) => async (dispatch) => {
  try {
    const account = await getDefaultAccount()
    const wagerToken = await getWagerToken()
    await wagerToken.transferFrom(from, to, value, { from: account })
  } catch (err) {
    console.error('transferFromToken', err)
  }
}

/**
 * Returns the amount of tokens that an owner allowed to a spender.
 * @param {object} tx
 * @param {string} tx.owner
 * @param {string} tx.spender
 * @returns {string}
 */
export const getTokenAllowance = ({ owner, spender }) => async (dispatch) => {
  try {
    const wagerToken = await getWagerToken()
    const allowance = await wagerToken.allowance(owner, spender)
    return bigNumToString(allowance)
  } catch (err) {
    console.error('getTokenAllowance', err)
    return null
  }
}
