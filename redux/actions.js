export const SET_ERROR_MODAL = 'SET_ERROR_MODAL'
export const SET_ETH_PRICE = 'SET_ETH_PRICE'
export const SET_NETWORK_TYPE = 'SET_NETWORK_TYPE'
export const SET_ORACLE_DATA = 'SET_ORACLE_DATA'
export const SET_USER_ADDRESS = 'SET_USER_ADDRESS'
export const SET_USER_TOKEN_BALANCE = 'SET_USER_TOKEN_BALANCE'
export const SET_WAGER_DATA = 'SET_WAGER_DATA'

export const setErrorModal = ({ message }) => ({
  type: SET_ERROR_MODAL,
  payload: { errorModal: { message } },
})

export const clearErrorModal = () => setErrorModal({ message: null })

export const setEthPrice = ethPrice => ({
  type: SET_ETH_PRICE,
  payload: { ethPrice },
})

export const setNetworkType = networkType => ({
  type: SET_NETWORK_TYPE,
  payload: { networkType },
})

export const setOracleData = ({ address, data }) => ({
  type: SET_ORACLE_DATA,
  payload: { address, data },
})

export const setUserAddress = address => ({
  type: SET_USER_ADDRESS,
  payload: { address },
})

export const setUserTokenBalance = tokenBalance => ({
  type: SET_USER_TOKEN_BALANCE,
  payload: { tokenBalance },
})

export const setWagerData = ({ address, data }) => ({
  type: SET_WAGER_DATA,
  payload: { address, data },
})
