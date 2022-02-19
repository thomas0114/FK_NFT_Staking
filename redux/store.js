import {
  createStore,
  applyMiddleware,
} from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'

import reducer from './reducer'

const middleware = [thunk, createLogger()]

export default initialState => createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)),
)
