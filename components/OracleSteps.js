import React from 'react'
import PropTypes from 'prop-types'
import {
  Icon,
  Step,
} from 'semantic-ui-react'

export const ORACLE_STAGES = {
  OPENED: 'Opened',
  CLOSED: 'Closed',
  TIED: 'Tied',
  RESOLVED: 'Resolved',
}

const OracleSteps = ({ stage }) => (
  <Step.Group size="tiny" fluid widths={3}>
    <Step active={stage === ORACLE_STAGES.OPENED}>
      <Icon name="group" />
      <Step.Content>
        <Step.Title>Created</Step.Title>
        <Step.Description>Waiting for approval.</Step.Description>
      </Step.Content>
    </Step>
    <Step active={stage === ORACLE_STAGES.CLOSED}>
      <Icon name="lock" />
      <Step.Content>
        <Step.Title>Closed</Step.Title>
        <Step.Description>No more voting.</Step.Description>
      </Step.Content>
    </Step>
    <Step active={stage === ORACLE_STAGES.RESOLVED}>
      <Icon name="winner" />
      <Step.Content>
        <Step.Title>Resolved</Step.Title>
        <Step.Description>Withdraw winnings!</Step.Description>
      </Step.Content>
    </Step>
  </Step.Group>
)

OracleSteps.propTypes = {
  stage: PropTypes.string.isRequired,
}

export default OracleSteps
