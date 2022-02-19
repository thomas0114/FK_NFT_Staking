import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Input } from 'semantic-ui-react'

import { getDeployedWagers, editWager } from '../redux/wager-thunks'

import Layout from '../components/Layout'
// import factory from '../ethereum/factory'
// import Layout from '../components/Layout'
// import { Link } from '../routes'

class Admin extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    wagers: PropTypes.object,
  }

  static defaultProps = {
    wagers: {},
  }

  state = {
    address: '',
    title: '',
    description: '',
  }

  onClickEdit = () => {
    const { dispatch } = this.props
    const { address, title, description } = this.state
    dispatch(editWager({ address, title, description }))
  }

  onClickWagers = () => {
    const { dispatch } = this.props
    dispatch(getDeployedWagers())
  }

  handleInputChange = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  render() {
    const {
      address,
      title,
      description,
    } = this.state
    return (
      <Layout>
        Admin
        <Button onClick={this.onClickWagers}>get Deployed Wagers</Button>
        <Input
          name="address"
          onChange={this.handleInputChange}
          placeholder="address"
          value={address}
        />
        <Input
          name="title"
          onChange={this.handleInputChange}
          placeholder="title"
          value={title}
        />
        <Input
          name="description"
          onChange={this.handleInputChange}
          placeholder="description"
          value={description}
        />
        <Button onClick={this.onClickEdit}>Edit</Button>
      </Layout>
    )
  }
}
const mapStateToProps = ({ wagers }) => ({ wagers })
export default connect(mapStateToProps)(Admin)
