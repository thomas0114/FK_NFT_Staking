import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Card,
} from 'semantic-ui-react'

import { Link } from '../server/routes'
import { unixToDisplayDate } from '../common'

const WagerCard = ({ wager }) => {
  const {
    address,
    title,
    description,
    minimumBet,
    lockTimestamp,
    outcome1,
    outcome2,
    winnerIndex,
    totalPlayers,
    stage,
    balance,
  } = wager
  const testvalue1 = Number(outcome1.pot)
  const testvalue2 = Number(outcome2.pot)
  let per1 = 1
  let per2 = 1
  if (testvalue1 > 0 || testvalue2 > 0) {
    per1 = Math.ceil((testvalue1 / (testvalue1 + testvalue2)) * 100)
    per2 = Math.ceil((testvalue2 / (testvalue1 + testvalue2)) * 100)
  }
  const lockDate = unixToDisplayDate(lockTimestamp)
  return (
    <Link route={`/wager/${address}`}>
      <Card>
        <Card.Content>
          <Card.Header>
            { title }
          </Card.Header>
          <Card.Meta>
            { description }
          </Card.Meta>
          <Card.Description>
            <div>Minimum Bet: { minimumBet } Ether</div>
            <div>End Time: { lockDate }</div>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button.Group fluid size="large">
            <Button style={{ flex: per1 }} color="red">{ outcome1.text }</Button>
            <Button.Or />
            <Button style={{ flex: per2 }} color="blue">{ outcome2.text }</Button>
          </Button.Group>
        </Card.Content>
      </Card>
    </Link>
  )
}

WagerCard.propTypes = {
  wager: PropTypes.object.isRequired,
}

export default WagerCard
