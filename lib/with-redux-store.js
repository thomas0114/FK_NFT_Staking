import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import App, { Container } from 'next/app'

import initializeStore from '../redux/store'

const isServer = typeof window === 'undefined'
const NEXT_REDUX_STORE = 'NEXT_REDUX_STORE'

const getOrCreateStore = (initialState) => {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return initializeStore(initialState)
  }

  // Store in global variable if client
  if (!window[NEXT_REDUX_STORE]) {
    window[NEXT_REDUX_STORE] = initializeStore(initialState)
  }
  return window[NEXT_REDUX_STORE]
}

export default (App) => {
  return class Redux extends Component {
    static async getInitialProps(appContext) {
      const reduxStore = getOrCreateStore()

      // Provide the store to getInitialProps of pages
      appContext.ctx.reduxStore = reduxStore

      let appProps = {}
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(appContext)
      }

      return {
        ...appProps,
        initialReduxState: reduxStore.getState(),
      }
    }

    static propTypes = {
      initialReduxState: PropTypes.object,
    }

    static defaultProps = {
      initialReduxState: {},
    }

    constructor(props) {
      super(props)
      this.reduxStore = getOrCreateStore(props.initialReduxState)
    }

    render() {
      return <App {...this.props} reduxStore={this.reduxStore} />
    }
  }
}
