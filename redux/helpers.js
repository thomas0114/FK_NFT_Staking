import axios from 'axios'
import { BigNumber } from 'bignumber.js'

import web3 from '../lib/web3'

export const bigNumToString = num => new BigNumber(num).toString()

export const weiToEther = wei => web3.utils.fromWei(wei, 'ether')

export const etherToWei = ether => web3.utils.toWei(ether, 'ether')

export const bigNumToEther = num => weiToEther(bigNumToString(num))

export const parseOutcomeData = (data) => {
  const text = data[0]
  const players = bigNumToString(data[1])
  const pot = bigNumToEther(data[2])
  const balances = bigNumToEther(data[3])
  return {
    text,
    players,
    pot,
    balances,
  }
}

export const parseOracleOutcomeData = (data) => {
  const text = data[0]
  const votes = bigNumToString(data[1])
  const balances = bigNumToString(data[2])
  return {
    text,
    votes,
    balances,
  }
}

export const getDefaultAccount = async () => {
  try {
    const accounts = await web3.eth.getAccounts()
    return accounts[0]
  } catch (err) {
    throw Error('Failed to get Default Account.', err)
  }
}

export const getEthToUsd = async () => {
  let price
  try {
    const { data: { data: { amount } } } = await axios({
      method: 'GET',
      url: 'https://api.coinbase.com/v2/prices/ETH-USD/sell',
    })
    price = amount
  } catch (err) {
    console.error('Failed to get Eth Price.', err)
  }
  return price
}

export const isInvalidAddressError = err => err.message === 'invalid address'
