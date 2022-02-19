import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  Button,
  Form,
  Input,
  Message,
} from 'semantic-ui-react'

import Layout from '../../components/Layout'
import { categoryOptions } from '../../common'

import { createWager } from '../../redux/wager-thunks'

class Index extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  state = {
    title: 'Is Ryan going to pass the Consensys Academy Bootcamp Program?',
    minimumBet: '0.1',
    maximumPot: '1',
    description: 'This depends on whether he can finish the final project on time',
    imageUrl: '',
    endDate: '',
    endTime: '00:00:00',
    category: '',
    outcome1: 'Yes',
    outcome2: 'No',
    isSuccess: null,
    hasSubmitted: false,
  }

  handleSubmit = async () => {
    const { dispatch } = this.props
    const {
      title,
      description,
      endDate,
      endTime,
      minimumBet,
      maximumPot,
      outcome1,
      outcome2,
    } = this.state
    // const lockTimestamp = moment.utc(`${endDate} ${endTime}`).format('X')
    const lockTimestamp = moment(moment(`${endDate} ${endTime}`).format('YYYY-MM-DD HH:mm:ssZ')).unix()
    await dispatch(createWager({
      title,
      description,
      lockTimestamp,
      minimumBet,
      maximumPot,
      outcome1,
      outcome2,
    }))
    Router.push('/')
  }

  handleInputChange = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleDropdown = input => (e, { value }) => {
    this.setState({ [input]: value })
  }

  render() {
    const {
      description,
      imageUrl,
      minimumBet,
      maximumPot,
      endDate,
      endTime,
      title,
      outcome1,
      outcome2,
      isSuccess,
      hasSubmitted,
    } = this.state
    return (
      <div>
        <Layout>
          <h1 size="large">Create Wager</h1>
          <p>Fill out the form to deploy a new wager onto the Ethereum blockchain!</p>
          <Form success={isSuccess === true} error={isSuccess === false} onSubmit={this.handleSubmit}>
            <Form.Input
              label="Title"
              name="title"
              onChange={this.handleInputChange}
              placeholder="Title of your bet"
              required
              value={title}
            />
            <Form.Group>
              <Form.Field required>
                <label>Minimum Bet</label>
                <Input
                  label={{ basic: true, content: 'Ether' }}
                  labelPosition="right"
                  name="minimumBet"
                  onChange={this.handleInputChange}
                  placeholder="Minimum bet..."
                  required
                  value={minimumBet}
                />
              </Form.Field>
              <Form.Field>
                <label>Maximum Total Pot</label>
                <Input
                  label={{ basic: true, content: 'Ether' }}
                  labelPosition="right"
                  name="maximumPot"
                  onChange={this.handleInputChange}
                  placeholder="Maximum Pot..."
                  value={maximumPot}
                />
              </Form.Field>
            </Form.Group>
            <Form.Input
              label="Description"
              name="description"
              onChange={this.handleInputChange}
              placeholder="Details regarding your bet"
              value={description}
            />
            <Form.Group>
              <Form.Input
                label="Close Date"
                min={new Date().toISOString().split('T')[0]}
                name="endDate"
                onChange={this.handleInputChange}
                placeholder="Close Date"
                required
                type="date"
                value={endDate}
              />
              <Form.Input
                label="Close Time"
                name="endTime"
                onChange={this.handleInputChange}
                placeholder="00:00:00"
                required
                type="time"
                value={endTime}
              />
            </Form.Group>
            <Form.Input
              label="Outcome 1"
              name="outcome1"
              onChange={this.handleInputChange}
              placeholder="Outcome 1"
              required
              value={outcome1}
            />
            <Form.Input
              label="Outcome 2"
              name="outcome2"
              onChange={this.handleInputChange}
              placeholder="Outcome 2"
              required
              value={outcome2}
            />
            <Form.Group>
              <Form.Dropdown
                label="Category"
                onChange={this.handleDropdown('category')}
                options={categoryOptions}
                placeholder="Select a Category"
                required
                selection
                width={5}
              />
              <Form.Input
                fluid
                label="Image Link"
                name="imageUrl"
                onChange={this.handleInputChange}
                placeholder="www.imgur.com/12345"
                value={imageUrl}
                width={11}
              />
            </Form.Group>
            <Form.Checkbox
              label="I agree to the Terms and Conditions"
              required
            />
            <Button primary type="submit">Submit</Button>
            { hasSubmitted && <Message
              success={isSuccess === true}
              error={isSuccess === false}
              header={isSuccess ? 'Wager Created' : 'Error'}
              content={isSuccess ? 'Successfully deployed to the Ethereum blockchain!' : 'Error deploying your wager.'}
            /> }
          </Form>
        </Layout>
      </div>
    )
  }
}

export default connect()(Index)
