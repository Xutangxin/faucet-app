// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Faucet is Ownable {
    IERC20 public token;
    uint256 public dripAmount = 100 * 10**18;
    mapping(address => bool) public hasClaimed;

    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
    }

    function requestTokens() external {
        require(!hasClaimed[msg.sender], "Already claimed");
        require(token.balanceOf(address(this)) >= dripAmount, "Faucet empty");
        hasClaimed[msg.sender] = true;
        token.transfer(msg.sender, dripAmount);
    }

    function refill(uint256 amount) external onlyOwner {
        token.transferFrom(msg.sender, address(this), amount);
    }

    function setDripAmount(uint256 _amount) external onlyOwner {
        dripAmount = _amount;
    }
}