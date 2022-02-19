import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import countdown from 'countdown'
import {
  Header,
  Segment,
  Button,
  Input,
  List,
  Label,
  Progress,
  Statistic,
} from 'semantic-ui-react'

import Loading from '../../components/Loading'
import Layout from '../../components/Layout'
import WagerSteps from '../../components/WagerSteps'
import { Link } from '../../server/routes'
import {
  getWagerSummary,
  placeBet,
  approveWager,
  closeWager,
  // setWinnerIndex,
  withdrawWinnings,
  createMatchingOracle,
  checkForWinner,
} from '../../redux/wager-thunks'
import { isDefinedAddress, unixToDisplayDate } from '../../common'

class WagerDetails extends Component {
  static getInitialProps(props) {
    return {
      address: props.query.address,
    }
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    address: PropTypes.string.isRequired,
    wager: PropTypes.object,
  }

  static defaultProps = {
    wager: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      bet: '',
      counter: '',
    }
    this.timer = null
    this.inputRef = React.createRef()
  }

  componentDidMount() {
    const { dispatch, address } = this.props
    dispatch(getWagerSummary({ address }))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.wager && !this.props.wager) {
      this.timer = setInterval(
        () => {
          const date = new Date(Number(nextProps.wager.lockTimestamp) * 1000)
          const counter = countdown(null, date).toString()
          this.setState({ counter })
        },
        1000,
      )
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  onClickApproveWager = () => {
    const { address, dispatch } = this.props
    dispatch(approveWager({ address }))
  }

  onClickCloseWager = () => {
    const { address, dispatch } = this.props
    dispatch(closeWager({ address }))
  }

  onClickWithdraw = () => {
    const { address, dispatch } = this.props
    dispatch(withdrawWinnings({ address }))
  }

  onClickCheckWinner = () => {
    const { address, dispatch } = this.props
    dispatch(checkForWinner({ address }))
  }

  onClickCreateOracle = () => {
    const { address, dispatch } = this.props
    dispatch(createMatchingOracle({ address }))
  }

  // handleOnClickWinner = winnerIndex => () => {
  //   const { address, dispatch } = this.props
  //   dispatch(setWinnerIndex({ address, winnerIndex }))
  // }

  handleOnClickOutcome = outcomeIndex => () => {
    const { address, dispatch } = this.props
    const { bet } = this.state
    if (!bet) {
      this.focusInput()
    } else {
      dispatch(placeBet({ address, bet, outcomeIndex }))
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
    const { address, wager } = this.props
    const { bet, counter } = this.state
    if (!wager) {
      return <Loading />
    }
    const {
      ceoAddress,
      creatorAddress,
      oracleAddress,
      title,
      description,
      minimumBet,
      maximumPot,
      lockTimestamp,
      outcome1,
      outcome2,
      winnerIndex,
      stage,
      remainingBalance,
    } = wager
    const outcome1Pot = Number(outcome1.pot)
    const outcome2Pot = Number(outcome2.pot)
    const totalPot = outcome1Pot + outcome2Pot
    const flex1 = totalPot === 0 ? 1 : Math.ceil((outcome1Pot / totalPot) * 100)
    const flex2 = totalPot === 0 ? 1 : Math.ceil((outcome2Pot / totalPot) * 100)
    return (
      <Layout>
        <Header as="h1">{ title }</Header>
        <Header as="h4">{ counter }</Header>
        <div>No more bets after { unixToDisplayDate(lockTimestamp) }</div>
        <br />
        <div>
          <div>Admin Controls (hidden from normal users)</div>
          <Button onClick={this.onClickApproveWager}>Approve</Button>
          <Button onClick={this.onClickCloseWager}>Close</Button>
          <Button onClick={this.onClickCreateOracle}>Start Vote</Button>
          {/* <Button onClick={this.handleOnClickWinner(1)}>set winner 1</Button>
          <Button onClick={this.handleOnClickWinner(2)}>set winner 2</Button> */}
          <Button onClick={this.onClickCheckWinner}>Check Winner</Button>
          <Button onClick={this.onClickWithdraw}>Withdraw</Button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Input
            label={{ basic: true, content: 'ETH' }}
            labelPosition="right"
            name="bet"
            onChange={this.handleInputChange}
            placeholder="Enter Bet"
            ref={this.inputRef}
            size="big"
            style={{ margin: '1em auto' }}
            value={bet}
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
            <Label color="red">{ outcome1.pot } ETH</Label>
            <Button
              animated="fade"
              color="red"
              fluid
              onClick={this.handleOnClickOutcome(1)}
              size="massive"
            >
              <Button.Content visible>{ outcome1.text }</Button.Content>
              <Button.Content hidden>Bet now!</Button.Content>
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
              <Button.Content hidden>Bet now!</Button.Content>
            </Button>
            <Label color="blue">{ outcome2.pot } ETH</Label>
          </Button>
        </div>
        <Progress
          color="green"
          label={`${totalPot} / ${maximumPot} Max ETH`}
          percent={Math.ceil((totalPot / maximumPot) * 100)}
          progress
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex ' }}>
            <Statistic>
              <Statistic.Value>{ outcome1.balances }</Statistic.Value>
              <Statistic.Label>My bet</Statistic.Label>
            </Statistic>
          </div>
          <div style={{ display: 'flex ' }}>
            <Statistic>
              <Statistic.Value>{ outcome2.balances }</Statistic.Value>
              <Statistic.Label>My bet</Statistic.Label>
            </Statistic>
          </div>
        </div>
        <WagerSteps
          isVotingStage={isDefinedAddress(oracleAddress)}
          stage={stage}
        />
        <Segment>
          <Header>Contract Details</Header>
          <p>{ description }</p>
          <List>
            <List.Item icon="users" content={`Minimum Bet: ${minimumBet} ETH`} />
            <List.Item icon="users" content={`Remaining Balance: ${remainingBalance} ETH`} />
            <List.Item icon="users" content={`Total Balance: ${Number(outcome1.pot) + Number(outcome2.pot)} ETH`} />
          </List>
          <List>
            <List.Item icon="users" content={`Wager Address: ${address}`} />
            <List.Item icon="users" content={`Creator Address: ${creatorAddress}`} />
            <List.Item icon="users" content={`CEO Address: ${ceoAddress}`} />
            { isDefinedAddress(oracleAddress)
              ? (
                <List.Item>
                  <List.Icon name="users" />
                  <List.Content>
                    <Link route={`/oracle/${oracleAddress}`}><a>Oracle Address: { oracleAddress }</a></Link>
                  </List.Content>
                </List.Item>
              )
              : <List.Item icon="users" content={`Oracle Address: ${oracleAddress}`} />
            }
            <List.Item icon="users" content={`Winning Outcome: ${winnerIndex}`} />
          </List>
        </Segment>
      </Layout>
    )
  }
}

const mapStateToProps = ({ wagers }, { address }) => ({ wager: wagers[address] })
export default connect(mapStateToProps)(WagerDetails)
