import contract from 'truffle-contract'

import OracleFactoryJson from '../build/contracts/OracleFactory.json'
import OracleJson from '../build/contracts/Oracle.json'
import PredictionMarketJson from '../build/contracts/PredictionMarket.json'
import WagerFactoryJson from '../build/contracts/WagerFactory.json'
import WagerJson from '../build/contracts/Wager.json'
import WagerTokenJson from '../build/contracts/WagerToken.json'

import { getProvider } from '../lib/web3'
import {
  PREDICTION_MARKET_ADDRESS,
  WAGER_TOKEN_ADDRESS,
} from '../config'

const fixContract = (c) => {
  if (typeof c.currentProvider.sendAsync !== 'function') {
    c.currentProvider.sendAsync = () => {
      return c.currentProvider.send.apply(
          c.currentProvider,
          arguments,
      )
    }
  }
  return c
}

export const getWagerToken = async () => {
  const wagerTokenContract = contract(WagerTokenJson)
  wagerTokenContract.setProvider(getProvider())
  const fixed = fixContract(wagerTokenContract)
  return fixed.at(WAGER_TOKEN_ADDRESS)
}

export const getPredictionMarket = async () => {
  const predictionMarketContract = contract(PredictionMarketJson)
  predictionMarketContract.setProvider(getProvider())
  const fixed = fixContract(predictionMarketContract)
  return fixed.at(PREDICTION_MARKET_ADDRESS)
}

export const getWagerFactory = async () => {
  try {
    const predictionMarket = await getPredictionMarket()
    const address = await predictionMarket.wagerFactoryAddress()
    const wagerFactoryContract = contract(WagerFactoryJson)
    wagerFactoryContract.setProvider(getProvider())
    const fixed = fixContract(wagerFactoryContract)

    return fixed.at(address)
  } catch (err) {
    throw err
  }
}

export const getOracleFactory = async () => {
  try {
    const predictionMarket = await getPredictionMarket()
    const address = await predictionMarket.oracleFactoryAddress()
    const oracleFactoryContract = contract(OracleFactoryJson)
    oracleFactoryContract.setProvider(getProvider())
    const fixed = fixContract(oracleFactoryContract)
    return fixed.at(address)
  } catch (err) {
    throw err
  }
}

export const getWager = async (address) => {
  const wagerContract = contract(WagerJson)
  wagerContract.setProvider(getProvider())
  const fixed = fixContract(wagerContract)
  return fixed.at(address)
}

export const getOracle = async (address) => {
  const oracleContract = contract(OracleJson)
  oracleContract.setProvider(getProvider())
  const fixed = fixContract(oracleContract)
  return fixed.at(address)
}
