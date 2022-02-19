import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Button,
  Header,
  Input,
  Label,
  List,
  Segment,
} from 'semantic-ui-react'

import {
  determineWinnerIndex,
  getOracleSummary,
  voteOnOracle,
  withdrawBadVotes,
  withdrawTokens,
} from '../../redux/oracle-thunks'
import { Link } from '../../server/routes'
import Loading from '../../components/Loading'
import Layout from '../../components/Layout'
import OracleSteps from '../../components/OracleSteps'
import { getTokenBalanceOf } from '../../redux/token-thunks'

class OracleDetails extends Component {
  static getInitialProps(props) {
    return {
      address: props.query.address,
    }
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    address: PropTypes.string.isRequired,
    oracles: PropTypes.object.isRequired,
    tokenBalance: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      vote: '',
    }
    this.inputRef = React.createRef()
  }

  componentDidMount() {
    const { dispatch, address } = this.props
    dispatch(getOracleSummary({ address }))
    dispatch(getTokenBalanceOf())
  }

  onClickDetermineWinner = () => {
    const { dispatch, address } = this.props
    dispatch(determineWinnerIndex({ address }))
  }

  onClickWithdrawTokens = () => {
    const { dispatch, address } = this.props
    dispatch(withdrawTokens({ address }))
  }

  onClickWithdrawBadVotes = () => {
    const { dispatch, address } = this.props
    dispatch(withdrawBadVotes({ address }))
  }

  handleOnClickOutcome = outcomeIndex => () => {
    const { dispatch, address } = this.props
    const { vote } = this.state
    if (!vote) {
      this.focusInput()
    } else {
      dispatch(voteOnOracle({ address, outcomeIndex, stake: vote }))
    }
  }

  handleInputChange = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  focusInput = () => {
    this.inputRef.current.focus()
  }

  render() {
    const { address, oracles, tokenBalance } = this.props
    const { vote } = this.state
    const oracle = oracles[address]
    if (!oracle) {
      return <Loading />
    }
    const {
      ceoAddress,
      tokenAddress,
      wagerAddress,

      winnerIndex,
      oraclePot,
      outcome1,
      outcome2,

      stage,
      remainingBalance,
    } = oracle

    const outcome1Votes = Number(outcome1.votes)
    const outcome2Votes = Number(outcome2.votes)
    const totalVotes = outcome1Votes + outcome2Votes
    const flex1 = totalVotes === 0 ? 1 : Math.ceil((outcome1Votes / totalVotes) * 100)
    const flex2 = totalVotes === 0 ? 1 : Math.ceil((outcome2Votes / totalVotes) * 100)
    return (
      <Layout>
        <h1>Oracle Details</h1>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Input
            label={{ basic: true, content: 'Tokens' }}
            labelPosition="right"
            name="vote"
            onChange={this.handleInputChange}
            placeholder="Enter Stake"
            ref={this.inputRef}
            size="big"
            style={{ margin: '1em auto' }}
            value={vote}
          />
        </div>
        <div style={{ display: 'flex' }}>
          <Button
            as="div"
            color="red"
            // disabled={stage !== STAGES.APPROVED}
            labelPosition="left"
            style={{ margin: 0, flex: flex1 }}
          >
            <Label color="red">{ outcome1.votes } Tokens</Label>
            <Button
              animated="fade"
              color="red"
              fluid
              onClick={this.handleOnClickOutcome(1)}
              size="massive"
            >
              <Button.Content visible>{ outcome1.text }</Button.Content>
              <Button.Content hidden>Vote now!</Button.Content>
            </Button>
          </Button>
          <Button
            as="div"
            color="blue"
            // disabled={stage !== STAGES.APPROVED}
            labelPosition="right"
            style={{ margin: 0, flex: flex2 }}
          >
            <Button
              animated="fade"
              color="blue"
              fluid
              onClick={this.handleOnClickOutcome(2)}
              size="massive"
            >
              <Button.Content visible>{ outcome2.text }</Button.Content>
              <Button.Content hidden>Vote Now!</Button.Content>
            </Button>
            <Label color="blue">{ outcome2.votes } Tokens</Label>
          </Button>
        </div>
        <OracleSteps stage={stage} />
        <Segment>
          <Header>Contract Details</Header>
          <List>
            <List.Item icon="users" content={`Remaining Balance: ${remainingBalance} ETH`} />
            <List.Item icon="users" content={`Total Commission: ${oraclePot} ETH`} />
          </List>
          <List>
            <List.Item icon="users" content={`Oracle Address: ${address}`} />
            <List.Item icon="users" content={`Token Address: ${tokenAddress}`} />
            <List.Item icon="users" content={`CEO Address: ${ceoAddress}`} />
            <List.Item>
              <List.Icon name="users" />
              <List.Content>
                <Link route={`/wager/${wagerAddress}`}><a>Wager Address: { wagerAddress }</a></Link>
              </List.Content>
            </List.Item>
          </List>
        </Segment>

        <div>My Outcome 1 Balance: { outcome1.balances }</div>
        <div>My Outcome 2 Balance: { outcome2.balances }</div>
        <div>Winner: { winnerIndex }</div>
        <div>My Remaining Token Count: { tokenBalance }</div>

        <Button onClick={this.onClickDetermineWinner}>Determine Winner</Button>
        <Button onClick={this.onClickWithdrawTokens}>Withdraw Tokens</Button>
        <Button onClick={this.onClickWithdrawBadVotes}>Withdraw Bad Votes</Button>
      </Layout>
    )
  }
}

const mapStateToProps = ({ oracles, user: { tokenBalance } }) => ({ oracles, tokenBalance })
export default connect(mapStateToProps)(OracleDetails)
