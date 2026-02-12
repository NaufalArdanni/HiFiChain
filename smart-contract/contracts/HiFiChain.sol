// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HiFiChain {
    
    struct AudioAsset {
        string modelName;
        string serialNumber;
        uint256 manufacturedDate;
        uint256 currentValueUSD;
        address currentOwner;
        bool exists;
    }

    mapping(string => AudioAsset) public assets;
    uint256 public exchangeRate; 
    
    address public owner;

    event AssetRegistered(string indexed serialNumber, string model, address indexed owner);
    event RateUpdated(uint256 newRate);

    modifier onlyOwner() {
        require(msg.sender == owner, "Security Error: Caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerAsset(string memory _model, string memory _serial, uint256 _price) public onlyOwner {
        require(!assets[_serial].exists, "Error: Asset already registered");

        assets[_serial] = AudioAsset({
            modelName: _model,
            serialNumber: _serial,
            manufacturedDate: block.timestamp,
            currentValueUSD: _price,
            currentOwner: msg.sender,
            exists: true
        });

        emit AssetRegistered(_serial, _model, msg.sender);
    }

    function verifyAsset(string memory _serial) public view returns (bool, string memory, address) {
        if (assets[_serial].exists) {
            return (true, assets[_serial].modelName, assets[_serial].currentOwner);
        } else {
            return (false, "", address(0));
        }
    }

    function updateExchangeRate(uint256 _rate) public onlyOwner {
        require(_rate > 0, "Error: Rate cannot be zero"); 
        exchangeRate = _rate;
        emit RateUpdated(_rate);
    }
}