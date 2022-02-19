pragma solidity ^0.4.25;

import "./Wager.sol";

contract WagerFactory {
    address public ceoAddress;
    address public oracleFactoryAddress;
    address[] public deployedWagers;
   
    constructor(address _ceoAddress, address _oracleFactoryAddress) public {
        ceoAddress = _ceoAddress;
        oracleFactoryAddress = _oracleFactoryAddress;
    }

    /** @dev Deploys a new wager contract through the factory that assigns
      * the CEO address and Oracle Factory address.
      * @param _title (string)
      * @param _description (string)
      * @param _lockTimestamp (uint)
      * @param _minimumBet (uint)
      * @param _maximumPot (uint)
      * @param _outcome1 (string)
      * @param _outcome2 (string)
      * @return newWager_ (address)
      */
    function createWager(
        string _title,
        string _description,
        uint _lockTimestamp,
        uint _minimumBet,
        uint _maximumPot,
        string _outcome1,
        string _outcome2
    ) public returns (address newWager_) {
        newWager_ = new Wager(
            ceoAddress,
            oracleFactoryAddress,
            msg.sender,
            _title,
            _description,
            _lockTimestamp,
            _minimumBet,
            _maximumPot,
            _outcome1,
            _outcome2
        );
        deployedWagers.push(newWager_);
    }
   
    function getDeployedWagers() public view returns (address[]) {
        return deployedWagers;
    }
}
