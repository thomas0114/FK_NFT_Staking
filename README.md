# EthWager
This project implements a prediction market decentralized application on the Ethereum blockchain. Users can create and make bets on anything with Ether. "WGR" token holders can settle wagers with the ERC20 compliant token and receive fees in Ether for correctly selecting the winner. The smart contracts are written in `Solidity`. The WebApp was built with `ReactJS`, `NextJS`, `NodeJS`, and `web3`.

# Setup
- yarn v1.13.0
- node v8.12.0 (seems like latest stable 10+ works too)
- ganache-cli v6.2.5
- Google Chrome (tested with v71)
- MetaMask Chrome Extension (tested with v5.3.1)

1. `yarn` - installs required package dependencies
2. `yarn compile` - compiles contracts with truffle
3. `ganache-cli` - starts local testnet blockchain (use a separate terminal tab and let it continue to run in the background)
4. `yarn test` - runs smart contract unit tests with truffle (requires ganache-cli to be running)
5. `yarn migrate` - migrate contracts to a locally running ganache-cli test blockchain on port 8545. <b>This command will also log the 4 addresses you need to manually change in `/config/index.js`. Update all 4 addresses if you want to test locally on gananche.</b>
6. `yarn start` - starts server at `localhost:1337`

# DApp Walkthrough
1.  Open Chome with MetaMask installed.
2.  Change MetaMask network option to `Localhost 8545` to use ganache local blockchain.
3.  Import wallet generated by ganache-cli by entering in Private Key (0) and your balance should be a ~99.8 ETH. This account is the admin of the deployed PredictionMarket contract. If you want to do more testing import additional accounts to MetaMask.
4.  Go to `localhost:1337`. (NextJS will take a couple seconds to render the page for the first time)
5.  MetaMask should popup notification asking for connect request. Click Connect.
6.  Main page is empty because there are no wagers yet. Click `+ Create Wager`.
7.  Fill out form and click `Submit`. Approve the transaction in MetaMask and wait for the page to redirect back to main page.
8.  Your wager should now be available on the main page. Click on the card to view details.
9.  Before users can place wagers, the wager needs to be approved by the admin. Since you are currently on the admin account, you may click `Approve` to approve the wager. 
10. Betting is now enabled. You can enter in a bet in ETH and click the RED or BLUE side to vote for the corresponding side. If you want to test betting with multiple accounts, you can switch your MetaMask account to other private keys generated by ganache-cli.
11. After bets are placed on both sides, switch back to your admin account (private key #0) and click the `Close` button in the Admin Controls. This prevents anyone from placing additional bets.
12. After the wager is closed, click `Start Vote` to deploy the matching Oracle contract that will be used for voting on the winner by token holders.
13. If the Oracle contract was deployed successfully, the `Oracle Address` field below in Contract Details should become a link. Click this link to view the corresponding Oracle contract instance. (NextJS will take a couple seconds to render the page for the first time)
14. On the Oracle Details page, "WGR" token holders determine the outcome of a wager by staking their coins. The winning outcome is the side with more coins (1 coin = 1 vote). Token holders that vote for the correct side get their tokens returned to them for future voting in addition to a percentage of the total pot. Token holders that vote for the incorrect side lose their tokens and do not get to collect the ETH reward. `My Remaining Token Count` shows your account's "WGR" token balance. The admin account by default holds all the tokens. If you are interested in testing multiple voters, go to the `Token` tab link on top to transfer tokens from the admin account to other accounts.
15. Enter however many tokens you want to stake on either side and click the RED side or BLUE side to vote. <b>IMPORTANT</b> - Click `Confirm` to APPROVE the contract to spend your ERC20 tokens, wait for the transaction to be mined, and then click `Confirm` again in MetaMask to vote. You must make 2 blockchain transactions because of the APPROVE required specs for ERC20 compliant tokens. See https://theethereum.wiki/w/index.php/ERC20_Token_Standard for more details.
16. Refresh the page and the new values for outcome1/outcome2 and my remaining token count should reflect the updated values.
17. Once voting is complete, switch back to the admin account and click `Determine Winner`. This will close voting and select the winner based on the vote counts.
18. Once the winner is selected, correct voters may now withdraw tokens and claim their Commission by clicking `Withdraw Tokens`.
19. Return to the Wager Address Details page.
20. Click `Check Winner` to check if the Oracle instance has selected a winner.
21. Winners may now click `Withdraw` to claim their ETH winnings!

# Final Project Requirement
### <b>Test Requirements</b>
- Oracle.sol (5 tests) - Verify that all functions work as expected, especially the voting mechanics.
- Wager.sol (10 tests) - Verify that all functions work as expected, especially the betting and withdrawing mechanics.
- tests run with truffle test
### <b>Design Pattern Requirements</b>
  - Implement Circuit Breaker - Wagers can be `Canceled` by the prediction market CEO in case a wager is ambiguous or invalid
- Other design patterns used:
  - Fail early and fail loud - reduce unnecessary code execution in the event that an exception will be thrown
  - Pull over Push Payments - protects against re-entrancy and denial of service attacks
  - State Machine - Wagers and Oracles have different options depending on current "Stage"
- Design patterns not used:
  - Auto Deprecation - unnecessary to have auto deprecation
  - Mortal - nobody should have ability to selfdestruct a Wager contract
  - Speed Bump - trading off speed of transactions not worth adding speed bump for withdraw
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
  - Integer Overflow and Underflow - used withdrawl pattern and SafeMath library.
  - Force Sending Ether - Having extra ether in Wager instances does not break contract functionality.
### <b>Use a library or extend a contract</b>
- SafeMath - library from OpenZeppelin
- ERC20 - WagerToken.sol extends Standard ERC20 token contract from OpenZeppelin

# Stretch Goals
- No IPFS
- Uses upgradable design pattern - Hub and Spoke Topology Design, new contract addresses can be swapped in PredictionMarket.sol and Wager/Oracle contract can be upgraded independently. (https://medium.com/rocket-pool/upgradable-solidity-contract-design-54789205276d)
- No contracts in Vyper or LLL
- No uPort
- No Ethereum Name Service
- No Oracle service

# Smart Contracts
### PredictionMarket.sol
PredictionMarket holds references to 4 addresses

- `ceoAddress` - the manager of this prediction market
- `tokenAddress` - the ERC20 token that is used for settling wagers
- `wagerFactoryAddress` - the address that holds references to all wager instances
- `oracleAddress` - the address that holds references to all oracle instances

### WagerToken.sol
WagerToken deploys the Standard ERC20 Token "WGR" with 0 decimals and and initial supply of 100 tokens. WGR allows its owners to settle bets and receive ETH from the total pot for their work. These values and quantities can be adjusted as neccessary for production.

### WagerFactory.sol
WagerFactory is used to deploy valid instances of Wagers used for betting. Anyone can call createWager to create a new wager instance that valid for the prediction market.

### Wager.sol
Contains all the core functionality of a bet. Some wager properties can be only changed by the "CEO" while others may be changed by the contract creator. Creator provide a title, description, end date, minimum bet size, maximum pot, and 2 possible outcomes. Wagers also have a Stage that determines what options are for the particular Wager.

- `Created` - Wager can be modified by the Creater/CEO
- `Approved` - Wager cannot be modified and anyone is allowed to place bets with Ether
- `Closed` - Bets no longer accepted and matching Oracle instance is created to determine winning outcome.
- `Cancelled` - CEO cancelled this contract and bets may be refunded.
- `Resolved` - Winning outcome has been selected and winners may withdraw their winnings.

### OracleFactory.sol
OracleFactory is used to deploy valid instances of Oracles used to settle Wagers.

### Oracle.sol
Deploys Oracle instances that are used for settling bets. "WGR" token holders vote on the actual outcome, whichever outcome receives the most tokens determines the winner of the wager. "WGR" token holders are incentivized to vote with their tokens because voters receive a percentage of the pot. "WGR" token holders that vote for the losing side lose their tokens and do not receive the voting reward.

# Deployed Smart Contract Addresses (Ropsten)
- Oracle Factory Address: `0x07bf9c485e641c480910989ab849fcfe5af301c9`
- Prediction Market Address: `0x688cf154b26f214bc68d888e6b0b33870a95d6b9`
- Wager Factory Address: `0x6b0361c4b7d8f55fed538e5602d16c51801b5e66`
- Wager Token Address: `0x0b705a2dc4a71f4b8b1cc285cc5f1ea47f8acce5`
