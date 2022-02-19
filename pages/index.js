import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Button, Card, Header } from 'semantic-ui-react'

import Layout from '../components/Layout'
import WagerCard from '../components/WagerCard'

import { getDeployedWagers } from '../redux/wager-thunks'
import { getEthPrice, getUserAddress } from '../redux/thunks'

class Index extends Component {
  static async getInitialProps({ reduxStore, req }) {
    const isServer = !!req
    console.log(reduxStore)
    // reduxStore.dispatch(getDeployedWagers())
    return { isServer }
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isServer: PropTypes.bool.isRequired,
    ethPrice: PropTypes.string,
    userAddress: PropTypes.string,
    wagers: PropTypes.object,
  }

  static defaultProps = {
    ethPrice: '',
    userAddress: '',
    wagers: {},
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getDeployedWagers())
    dispatch(getEthPrice())
    dispatch(getUserAddress())
  }

  onClickWagers = () => {
    const { dispatch } = this.props
    dispatch(getDeployedWagers())
  }

  render() {
    const { isServer, userAddress, wagers } = this.props
    const addresses = Object.keys(wagers)
    console.log(`Rendered from ${isServer ? 'Server' : 'Client'}`)
    return (
      <Layout>
        <div>
          <Header>Current Ethereum Account: {userAddress}</Header>
          <Button primary onClick={this.onClickWagers}>Refresh Wagers</Button>
        </div>
        <br />
        <Card.Group doubling itemsPerRow={3} stackable>
          { addresses.map(address => <WagerCard key={address} wager={wagers[address]} />) }
        </Card.Group>
      </Layout>
    )
  }
}

const mapStateToProps = ({
  ethPrice,
  user: { address },
  wagers,
}) => ({
  userAddress: address,
  ethPrice,
  wagers,
})
export default connect(mapStateToProps)(Index)
