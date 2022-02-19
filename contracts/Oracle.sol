pragma solidity ^0.4.25;

import "./WagerToken.sol";
import "./math/SafeMath.sol";

contract Oracle {
    using SafeMath for uint;

    enum Stages {
        Opened,
        Closed,
        Tied,
        Resolved
    }
    Stages public stage;

    struct Outcome {
        string text;
        uint votes;
        mapping(address => uint) balances;
    }
    Outcome[] outcomes;

    WagerToken token;
    address public ceoAddress;
    address public tokenAddress;
    address public wagerAddress;

    uint public winnerIndex;
    uint public oraclePot;

    modifier onlyCeo {
        require(msg.sender == ceoAddress, "Not CEO");
        _;
    }

    modifier atStage(Stages _stage) {
        require(_stage == stage, "Wrong Stage");
        _;
    }

    constructor(
        address _ceoAddress,
        address _tokenAddress,
        address _wagerAddress,
        string _outcome1,
        string _outcome2
    ) public payable {
        ceoAddress = _ceoAddress;
        tokenAddress = _tokenAddress;
        token = WagerToken(_tokenAddress);
        wagerAddress = _wagerAddress;
        outcomes.push(Outcome({ text: "null", votes: 0 }));
        outcomes.push(Outcome({ text: _outcome1, votes: 0 }));
        outcomes.push(Outcome({ text: _outcome2, votes: 0 }));
        oraclePot = msg.value;
        stage = Stages.Opened;
    }

    function getOutcomeData(uint _outcomeIndex) public view returns (string memory, uint, uint) {
        Outcome storage outcome = outcomes[_outcomeIndex];
        return (
            outcome.text,
            outcome.votes,
            outcome.balances[msg.sender]
        );
    }

    function getStage() public view returns (string memory) {
        if (stage == Stages.Opened) {
            return "Opened";
        } else if (stage == Stages.Closed) {
            return "Closed";
        } else if (stage == Stages.Tied) {
            return "Tied";
        } else if (stage == Stages.Resolved) {
            return "Resolved";
        }
        return "Error";
    }

    function openVoting() public onlyCeo {
        stage = Stages.Opened;
    }

    function closeVoting() public onlyCeo {
        stage = Stages.Closed;
    }

    // user needs to approve token stake before calling vote
    // tokenAddress.approve(oracleAddress, stake)
    function vote(uint _outcomeIndex, uint _stake) public atStage(Stages.Opened) returns (bool) {
        require(_outcomeIndex > 0 && _outcomeIndex < outcomes.length);
        require(token.transferFrom(msg.sender, this, _stake));
        Outcome storage outcome = outcomes[_outcomeIndex];
        outcome.votes = outcome.votes.add(_stake);
        outcome.balances[msg.sender] = outcome.balances[msg.sender].add(_stake);
        return true;
    }

    function determineWinnerIndex() public onlyCeo atStage(Stages.Opened) returns (uint) {
        uint currentWinnerIndex;
        uint currentMaxVotes;
        bool isTied = false;
        for (uint i = 0; i < outcomes.length; i++) {
            Outcome memory outcome = outcomes[i];
            if (outcome.votes > currentMaxVotes) {
                currentMaxVotes = outcome.votes;
                currentWinnerIndex = i;
                isTied = false;
            } else if (outcome.votes == currentMaxVotes) {
                isTied = true;
            }
        }
        if (isTied) {
            stage = Stages.Tied;
            // need to handle Stages.Tied
        } else {
            winnerIndex = currentWinnerIndex;
            stage = Stages.Resolved;
        }
        return winnerIndex;
    }

    // returns index if voting over, Tie if 0
    function getWinnerIndex() public view returns (uint) {
        require(stage == Stages.Resolved || stage == Stages.Tied);
        return winnerIndex;
    }

    // return tokens of correct voters and pay dividends
    function withdrawTokens() public atStage(Stages.Resolved) returns (uint tokensToWithdraw_) {
        require(winnerIndex != 0);
        Outcome storage winOutcome = outcomes[winnerIndex];
        tokensToWithdraw_ = winOutcome.balances[msg.sender];
        winOutcome.balances[msg.sender] = 0;
        require(token.transfer(msg.sender, tokensToWithdraw_));
        msg.sender.transfer(oraclePot.mul(tokensToWithdraw_).div(winOutcome.votes));
    }

    function refundTokens() public atStage(Stages.Tied) returns (uint tokensToWithdraw_) {
        for (uint i = 1; i < outcomes.length; i++) {
            tokensToWithdraw_ = tokensToWithdraw_.add(outcomes[i].balances[msg.sender]);
            outcomes[i].votes = 0;
        }
        require(token.transfer(msg.sender, tokensToWithdraw_));
    }

    // transfer bad vote tokens to CEO
    function withdrawBadVotes() public atStage(Stages.Resolved) returns (uint badVotes_) {
        for (uint i = 1; i < outcomes.length; i++) {
            if (i != winnerIndex) {
                badVotes_ = badVotes_.add(outcomes[i].votes);
                outcomes[i].votes = 0;
            }
        }
        require(token.transfer(ceoAddress, badVotes_));
    }

    function() public payable {
        revert();
    }
}
