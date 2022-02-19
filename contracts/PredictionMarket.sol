pragma solidity ^0.4.25;

contract PredictionMarket {

    address public ceoAddress;
    address public tokenAddress;
    address public wagerFactoryAddress;
    address public oracleFactoryAddress;

    modifier onlyCeo() {
        require(msg.sender == ceoAddress, "Not CEO");
        _;
    }

    constructor(address _tokenAddress, address _oracleFactoryAddress, address _wagerFactoryAddress) public {
        ceoAddress = msg.sender;
        tokenAddress = _tokenAddress;
        oracleFactoryAddress = _oracleFactoryAddress;
        wagerFactoryAddress = _wagerFactoryAddress;
    }

    function setCeo(address _ceoAddress) public onlyCeo {
        ceoAddress = _ceoAddress;
    }

    function setTokenAddress(address _tokenAddress) public onlyCeo {
        tokenAddress = _tokenAddress;
    }

    function setWagerFactoryAddress(address _wagerFactoryAddress) public onlyCeo {
        wagerFactoryAddress = _wagerFactoryAddress;
    }

    function setOracleFactoryAddress(address _oracleFactoryAddress) public onlyCeo {
        oracleFactoryAddress = _oracleFactoryAddress;
    }
}
