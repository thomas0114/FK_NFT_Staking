import {
  SET_ERROR_MODAL,
  SET_ETH_PRICE,
  SET_NETWORK_TYPE,
  SET_ORACLE_DATA,
  SET_USER_ADDRESS,
  SET_USER_TOKEN_BALANCE,
  SET_WAGER_DATA,
} from './actions'

export const defaultState = {
  errorModal: { message: null },
  ethPrice: '',
  networkType: '',
  oracles: {},
  user: {
    address: '',
    tokenBalance: '',
  },
  wagers: {},
}

const mainReducer = (state = defaultState, { type, payload }) => {
  const extendState = () => ({ ...state, ...payload })
  switch (type) {
    case SET_ERROR_MODAL:
      return extendState()
    case SET_ETH_PRICE:
      return extendState()
    case SET_NETWORK_TYPE:
      return extendState()
    case SET_ORACLE_DATA:
      return {
        ...state,
        oracles: {
          ...state.wagers,
          [payload.address]: payload.data,
        },
      }
    case SET_USER_ADDRESS:
      return {
        ...state,
        user: {
          ...state.user,
          address: payload.address,
        },
      }
    case SET_USER_TOKEN_BALANCE:
      return {
        ...state,
        user: {
          ...state.user,
          tokenBalance: payload.tokenBalance,
        },
      }
    case SET_WAGER_DATA:
      return {
        ...state,
        wagers: {
          ...state.wagers,
          [payload.address]: payload.data,
        },
      }
    default:
      return state
  }
}

export default mainReducer
