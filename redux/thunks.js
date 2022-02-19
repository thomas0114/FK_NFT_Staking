import web3 from '../lib/web3'
import { isInvalidAddressError, getDefaultAccount, getEthToUsd } from './helpers'
import {
  setErrorModal,
  setNetworkType,
  setUserAddress,
  setEthPrice,
} from './actions'

export const handleError = err => (dispatch) => {
  let { message } = err
  if (isInvalidAddressError(err)) {
    message = 'Your MetaMask account is locked.'
  }
  dispatch(setErrorModal({ message }))
}

export const getNetworkType = () => async (dispatch) => {
  const networkType = await web3.eth.net.getNetworkType()
  dispatch(setNetworkType(networkType))
}

export const getUserAddress = () => async (dispatch) => {
  try {
    const account = await getDefaultAccount()
    dispatch(setUserAddress(account))
  } catch (err) {
    console.error('getUserAddress', err)
  }
}

export const getEthPrice = () => async (dispatch) => {
  try {
    const ethPrice = await getEthToUsd()
    if (ethPrice) {
      dispatch(setEthPrice(ethPrice))
    }
  } catch (err) {
    console.error('getEthPrice', err)
  }
}