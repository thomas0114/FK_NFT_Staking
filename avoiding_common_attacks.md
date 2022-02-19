### <b>Security Tools / Common Attacks</b>
  - Reentrancy - do the internal work before making the external function call
    ```javascript
    function withdrawWinnings () public atStage(Stages.Resolved) returns (uint winnings_) {
        require(winnerIndex != 0);
        Outcome storage winOutcome = outcomes[winnerIndex];
        winnings_ = totalPot.mul(winOutcome.balances[msg.sender]).div(winOutcome.pot);
        winOutcome.balances[msg.sender] = 0;
        msg.sender.transfer(winnings_);
    }
    ```
  - Transaction Ordering and Timestamp Dependence - unable to mitigate this issue.
  - Integer Overflow and Underflow - used withdrawl pattern and SafeMath library to prevent common overflow/underflow issues.
  - Force Sending Ether - Having extra ether in Wager instances does not break contract functionality. Every function was programed with this possibility in mind.
