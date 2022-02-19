import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Form,
  Header,
} from 'semantic-ui-react'

import { getTokenBalanceOf, transferToken, approveToken, transferFromToken } from '../redux/token-thunks'
import Layout from '../components/Layout'
import { getUserAddress } from '../redux/thunks'
import { isValidAddress, isPositiveValue } from '../common'

const FORM_SIZE = 'big'

class Token extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    tokenBalance: PropTypes.string.isRequired,
  }

  state = {
    approveSpender: '',
    approveSpenderError: false,
    approveValue: '1',
    approveValueError: false,

    transferFromFrom: '',
    transferFromFromError: false,
    transferFromTo: '',
    transferFromToError: false,
    transferFromValue: '',
    transferFromValueError: false,


    transferTo: '',
    transferToError: false,
    transferValue: '1',
    transferValueError: false,
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getUserAddress())
    dispatch(getTokenBalanceOf())
  }

  onClickTransfer = () => {
    const { dispatch } = this.props
    const { transferTo, transferValue } = this.state
    const transferToError = !isValidAddress(transferTo)
    const transferValueError = !isPositiveValue(transferValue)
    this.setState({ transferToError, transferValueError })
    if (!transferToError && !transferValueError) {
      dispatch(transferToken({ to: transferTo, value: transferValue }))
    }
  }

  onClickApprove = () => {
    const { dispatch } = this.props
    const { approveSpender, approveValue } = this.state
    const approveSpenderError = !isValidAddress(approveSpender)
    const approveValueError = !isPositiveValue(approveValue)
    this.setState({ approveSpenderError, approveValueError })
    if (!approveSpenderError && !approveValueError) {
      dispatch((approveToken({ spender: approveSpender, value: approveValue })))
    }
  }

  onClickTransferFrom = () => {
    const { dispatch } = this.props
    const {
      transferFromFrom,
      transferFromTo,
      transferFromValue,
    } = this.state
    const transferFromFromError = !isValidAddress(transferFromFrom)
    const transferToError = !isValidAddress(transferFromTo)
    const transferFromValueError = !isPositiveValue(transferFromValue)
    this.setState({ transferFromFromError, transferToError, transferFromValueError })
    if (!transferFromFromError && !transferToError && !transferFromValueError) {
      dispatch(transferFromToken({
        from: transferFromFrom,
        to: transferFromTo,
        value: transferFromValue,
      }))
    }
  }

  handleInputChange = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  renderTransferForm() {
    const {
      transferTo,
      transferToError,
      transferValue,
      transferValueError,
    } = this.state
    return (
      <Form>
        <Form.Group widths="equal">
          <Form.Input
            error={transferToError}
            label="To (Address)"
            name="transferTo"
            onChange={this.handleInputChange}
            placeholder="to"
            size={FORM_SIZE}
            value={transferTo}
          />
          <Form.Input
            error={transferValueError}
            label="Value (Tokens)"
            name="transferValue"
            onChange={this.handleInputChange}
            placeholder="value"
            size={FORM_SIZE}
            value={transferValue}
          />
          <Form.Button
            label={<label>&nbsp;</label>}
            onClick={this.onClickTransfer}
            size={FORM_SIZE}
          >
            Transfer
          </Form.Button>
        </Form.Group>
      </Form>
    )
  }

  renderApproveForm() {
    const {
      approveSpender,
      approveSpenderError,
      approveValue,
      approveValueError,
    } = this.state
    return (
      <Form>
        <Form.Group widths="equal">
          <Form.Input
            error={approveSpenderError}
            label="Spender (Address)"
            name="approveSpender"
            onChange={this.handleInputChange}
            placeholder="to"
            size={FORM_SIZE}
            value={approveSpender}
          />
          <Form.Input
            error={approveValueError}
            label="Value (Tokens)"
            name="approveValue"
            onChange={this.handleInputChange}
            placeholder="value"
            size={FORM_SIZE}
            value={approveValue}
          />
          <Form.Button
            label={<label>&nbsp;</label>}
            onClick={this.onClickApprove}
            size={FORM_SIZE}
          >
            Approve
          </Form.Button>
        </Form.Group>
      </Form>
    )
  }

  renderTransferFromForm() {
    const {
      transferFromFrom,
      transferFromFromError,
      transferFromTo,
      transferFromToError,
      transferFromValue,
      transferFromValueError,
    } = this.state
    return (
      <Form>
        <Form.Group widths="equal">
          <Form.Input
            error={transferFromFromError}
            label="From (Address)"
            name="transferFromFrom"
            onChange={this.handleInputChange}
            placeholder="from"
            size={FORM_SIZE}
            value={transferFromFrom}
          />
          <Form.Input
            error={transferFromToError}
            label="To (Address)"
            name="transferFromTo"
            onChange={this.handleInputChange}
            placeholder="to"
            size={FORM_SIZE}
            value={transferFromTo}
          />
          <Form.Input
            error={transferFromValueError}
            label="Value (Tokens)"
            name="transferFromValue"
            onChange={this.handleInputChange}
            placeholder="value"
            size={FORM_SIZE}
            value={transferFromValue}
          />
          <Form.Button
            label={<label>&nbsp;</label>}
            onClick={this.onClickTransferFrom}
            size={FORM_SIZE}
          >
            TransferFrom
          </Form.Button>
        </Form.Group>
      </Form>
    )
  }

  render() {
    const { address, tokenBalance } = this.props
    return (
      <Layout>
        <Header>Token Admin Page - use this page to distribute WGR tokens!</Header>
        <div>my address: { address } </div>
        <div>token balance: { tokenBalance } </div>
        { this.renderTransferForm() }
        { this.renderApproveForm() }
        { this.renderTransferFromForm() }
      </Layout>
    )
  }
}

const mapStateToProps = ({ user: { address, tokenBalance }}) => ({ address, tokenBalance })
export default connect(mapStateToProps)(Token)
