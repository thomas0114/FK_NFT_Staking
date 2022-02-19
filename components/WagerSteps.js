import React from 'react'
import PropTypes from 'prop-types'
import {
  Icon,
  Step,
} from 'semantic-ui-react'

export const WAGER_STAGES = {
  CREATED: 'Created',
  APPROVED: 'Approved',
  CLOSED: 'Closed',
  CANCELLED: 'Cancelled',
  RESOLVED: 'Resolved',
  ERROR: 'Error',
}

const WagerSteps = ({ isVotingStage, stage }) => (
  <Step.Group size="tiny" fluid widths={5}>
    <Step active={stage === WAGER_STAGES.CREATED}>
      <Icon name="write" />
      <Step.Content>
        <Step.Title>Created</Step.Title>
        <Step.Description>Waiting for approval.</Step.Description>
      </Step.Content>
    </Step>
    <Step active={stage === WAGER_STAGES.APPROVED}>
      <Icon name="dollar" />
      <Step.Content>
        <Step.Title>Approved</Step.Title>
        <Step.Description>Open bets!</Step.Description>
      </Step.Content>
    </Step>
    <Step active={stage === WAGER_STAGES.CLOSED && !isVotingStage}>
      <Icon name="lock" />
      <Step.Content>
        <Step.Title>Closed</Step.Title>
        <Step.Description>No more bets.</Step.Description>
      </Step.Content>
    </Step>
    <Step active={stage === WAGER_STAGES.CLOSED && isVotingStage}>
      <Icon name="group" />
      <Step.Content>
        <Step.Title>Voting</Step.Title>
        <Step.Description>Token holders select winner.</Step.Description>
      </Step.Content>
    </Step>
    <Step active={stage === WAGER_STAGES.RESOLVED}>
      <Icon name="winner" />
      <Step.Content>
        <Step.Title>Resolved</Step.Title>
        <Step.Description>Withdraw winnings!</Step.Description>
      </Step.Content>
    </Step>
  </Step.Group>
)

WagerSteps.propTypes = {
  isVotingStage: PropTypes.bool,
  stage: PropTypes.string,
}

WagerSteps.defaultProps = {
  isVotingStage: false,
  stage: 'Error',
}

export default WagerSteps
