import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Button,
  Header,
  Icon,
  Image,
  Modal
} from 'semantic-ui-react'
import { clearErrorModal } from '../redux/actions'

class ErrorModal extends Component {
  onCloseModal = (e) => {
    const { dispatch } = this.props
    dispatch(clearErrorModal())
  }

  render() {
    const { errorModal } = this.props
    return (
      <Modal
        closeIcon
        dimmer="inverted"
        onClose={this.onCloseModal}
        open={!!errorModal.message}
        size="tiny"
        style={{ display: 'flex!important' }}
      >
        <Modal.Header>Error</Modal.Header>
        <Modal.Content image>
          <Icon color="red" name="warning sign" size="large" />
          <Modal.Description>
            <p>{ errorModal.message }</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.onCloseModal}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

ErrorModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
  errorModal: PropTypes.object.isRequired,
}

const mapStateToProps = ({ errorModal }) => ({ errorModal })
export default connect(mapStateToProps)(ErrorModal)
