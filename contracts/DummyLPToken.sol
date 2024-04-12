// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts@4.8.3/token/ERC20/ERC20.sol";

contract DummyLPToken is ERC20 {
    address public token;

    constructor(
        address _token,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
        token = _token;
    }

    function zapIn(uint256 amount) public {
        uint256 supply = totalSupply();
        uint256 shares;
        if (supply == 0) {
            shares = amount;
        } else {
            shares = (amount * supply) / ERC20(token).balanceOf(address(this));
        }

        ERC20(token).transferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, amount);
    }

    function zapOut(uint256 amount) public {
        uint256 supply = totalSupply();
        uint256 balance = ERC20(token).balanceOf(address(this));
        uint256 toSend = (amount * balance) / supply;
        ERC20(token).transfer(msg.sender, toSend);
        _burn(msg.sender, amount);
    }
}

// etherlink testnet: 0x7655E88FAa8032FFE56b89Df9b704efB31591aA3
