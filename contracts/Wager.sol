pragma solidity ^0.4.25;

import "./OracleFactory.sol";
import "./Oracle.sol";
import "./math/SafeMath.sol";

contract Wager {
    using SafeMath for uint;

    enum Stages {
        Created,
        Approved,
        Closed,
        Cancelled, // has no winner
        Resolved // has winner
    }
    Stages public stage;

    struct Outcome {
        string text;
        uint players;
        uint pot;
        mapping(address => uint) balances;
    }
    Outcome[] outcomes;

    address public ceoAddress;
    address public oracleFactoryAddress;
    address public creatorAddress;
    address public oracleAddress;

    uint public constant MANAGER_FEE_PERCENT = 1;
    uint public constant REFUND_FEE_PERCENT = 0;
    uint public constant ORACLE_FEE_PERCENT = 2;
   
    string public title;
    string public description;
    uint public lockTimestamp;
    uint public minimumBet;
    uint public maximumPot;
    
    uint public winnerIndex;
    uint public totalPot;
   
    modifier onlyCeo() {
        require(msg.sender == ceoAddress, "Not CEO");
        _;
    }

    modifier onlyCeoOrCreator() {
        require(msg.sender == ceoAddress || msg.sender == creatorAddress, "Not CEO or Creator");
        _;
    }
   
    modifier atStage(Stages _stage) {
        require(stage == _stage, "Wrong Stage");
        _;
    }

    constructor(
        address _ceoAddress,
        address _oracleFactoryAddress,
        address _creatorAddress,
        string _title,
        string _description,
        uint _lockTimestamp,
        uint _minimumBet,
        uint _maximumPot,
        string _outcome1,
        string _outcome2
    ) public {
        ceoAddress = _ceoAddress;
        oracleFactoryAddress = _oracleFactoryAddress;
        creatorAddress = _creatorAddress;
        title = _title;
        description = _description;
        lockTimestamp = _lockTimestamp;
        minimumBet = _minimumBet;
        maximumPot = _maximumPot;
        outcomes.push(Outcome({ text: "null", players: 0, pot: 0 }));
        outcomes.push(Outcome({ text: _outcome1, players: 0, pot: 0 }));
        outcomes.push(Outcome({ text: _outcome2, players: 0, pot: 0 }));
        stage = Stages.Created;
    }

    function getOutcomeData(uint _outcomeIndex) public view returns (
        string,
        uint,
        uint,
        uint
    ) {
        Outcome storage outcome = outcomes[_outcomeIndex];
        return (
            outcome.text,
            outcome.players,
            outcome.pot,
            outcome.balances[msg.sender]
        );
    }

    /** @dev get current stage of contract.
      * @return current staget
      */
    function getStage() public view returns (string) {
        if (stage == Stages.Created) {
            return "Created";
        } else if (stage == Stages.Approved) {
            return "Approved";
        } else if (stage == Stages.Closed) {
            return "Closed";
        } else if (stage == Stages.Cancelled) {
            return "Cancelled";
        } else if (stage == Stages.Resolved) {
            return "Resolved";
        }
        return "Error";
    }

    /** @dev edit wager title.
      * @param _title (string)
      */
    function setTitle(string _title) public onlyCeoOrCreator atStage(Stages.Created) {
        title = _title;
    }
   
    /** @dev edit wager description.
      * @param _description (string)
      */
    function setDescription(string _description) public onlyCeoOrCreator atStage(Stages.Created) {
        description = _description;
    }

    function setOutcome(uint _outcomeIndex, string _outcomeText) public onlyCeoOrCreator atStage(Stages.Created) {
        require(_outcomeIndex > 0 && _outcomeIndex < outcomes.length);
        outcomes[_outcomeIndex].text = _outcomeText;
    }

    function setMinimumBet(uint _minimumBet) public onlyCeoOrCreator atStage(Stages.Created) {
        minimumBet = _minimumBet;
    }

    function setMaximumPot(uint _maximumPot) public onlyCeoOrCreator atStage(Stages.Created) {
        maximumPot = _maximumPot;
    }

    /** @dev opens betting */
    function approveWager() public onlyCeo atStage(Stages.Created) {
        stage = Stages.Approved;
    }
    /** @dev CIRCUIT BREAKER - enables refund */
    function cancelWager() public onlyCeo {
        stage = Stages.Cancelled;
    }
    /** @dev closes betting  */
    function closeWager() public onlyCeo atStage(Stages.Approved) {
        stage = Stages.Closed;
    }

    /** @dev Allows sender to place bet.
      * @param _outcomeIndex (uint)
      * @return true if successful.
      */
    function placeBet(uint _outcomeIndex) public payable atStage(Stages.Approved) returns (bool) {
        uint newTotalPot = totalPot.add(msg.value);
        require(newTotalPot <= maximumPot);
        require(msg.value >= minimumBet);
        require(_outcomeIndex > 0 && _outcomeIndex < outcomes.length);
        // require(lockTimestamp > now); // autoclose here?
        Outcome storage outcome = outcomes[_outcomeIndex];
        if (outcome.balances[msg.sender] == 0) {
            outcome.players = outcome.players.add(1);
        }
        totalPot = newTotalPot;
        outcome.pot = outcome.pot.add(msg.value);
        outcome.balances[msg.sender] = outcome.balances[msg.sender].add(msg.value);
        return true;
    }
   
    /** @dev Override that allows CEO to set winner, remove this in production.
      * @param _winnerIndex (uint)
      */ 
    function setWinnerIndex(uint _winnerIndex) public onlyCeo atStage(Stages.Closed) {
        require(_winnerIndex > 0 && _winnerIndex < outcomes.length);
        winnerIndex = _winnerIndex;
        stage = outcomes[winnerIndex].players == 0 ? Stages.Cancelled : Stages.Resolved;
    }

    /** @dev Creates matching oracle contract that allows token holders to vote and select winner. */
    function createMatchingOracle() public onlyCeo atStage(Stages.Closed) {
        require(oracleAddress == address(0)); // cannot call again if already has oracle address
        uint oracleFee = totalPot.mul(ORACLE_FEE_PERCENT).div(100);
        totalPot = totalPot.sub(oracleFee);
        oracleAddress = OracleFactory(oracleFactoryAddress).createOracle.value(oracleFee)(
            outcomes[1].text,
            outcomes[2].text
        );
    }

    /** @dev Checks if matching oracle contract has determined the winner. */
    function checkForWinner() public onlyCeo atStage(Stages.Closed) {
        winnerIndex = Oracle(oracleAddress).getWinnerIndex();
        require(winnerIndex < outcomes.length);
        if (winnerIndex == 0 || outcomes[winnerIndex].players == 0) {
            stage = Stages.Cancelled;
        } else {
            stage = Stages.Resolved;
        }
    }

    /** @dev Allows user to withdraw winnings.
      * @return winnings_ amount (ETH)
      */
    function withdrawWinnings () public atStage(Stages.Resolved) returns (uint winnings_) {
        require(winnerIndex != 0);
        Outcome storage winOutcome = outcomes[winnerIndex];
        winnings_ = totalPot.mul(winOutcome.balances[msg.sender]).div(winOutcome.pot);
        winOutcome.balances[msg.sender] = 0;
        msg.sender.transfer(winnings_);
    }
   
    /** @dev CIRCUIT BREAKER - Allows user to withdraw bet if this wager contract was cancelled.
      * @return refund_ amount (ETH)
      */
    function refundBets () public atStage(Stages.Cancelled) returns (uint refund_) {
        for (uint i = 1; i < outcomes.length; i++) {
            refund_ = refund_.add(outcomes[i].balances[msg.sender]);
            outcomes[i].balances[msg.sender] = 0;
        }
        msg.sender.transfer(refund_);
    }

    function() public payable {
        revert();
    }
}
