pragma solidity ^0.4.25;

import "./Oracle.sol";

contract OracleFactory {
    address public ceoAddress;
    address public tokenAddress;
    address[] public deployedOracles;
   
    constructor(address _ceoAddress, address _tokenAddress) public {
        ceoAddress = _ceoAddress;
        tokenAddress = _tokenAddress;
    }

    /** @dev Deploys a new Oracle contract through the factory that assigns
      * the CEO address and tokenAddress.
      * @param _outcome1 (string)
      * @param _outcome2 (string)
      * @return newOracle_ (address)
      */
    function createOracle(string _outcome1, string _outcome2) public payable returns (address newOracle_) {
        // only called by Wager Contract itself
        newOracle_ = (new Oracle).value(msg.value)(
            ceoAddress,
            tokenAddress,
            msg.sender, // wager address
            _outcome1,
            _outcome2
        );
        deployedOracles.push(newOracle_);
    }
   
    function getDeployedOracles() public view returns (address[]) {
        return deployedOracles;
    }
}
