// SPDX-License-Identifier: MIT


pragma solidity ^0.8.9;

contract TokenBank {
    //Token Name
    string private _name;
    //Token Symbol
    string private _symbol;

    //Token totla suply
    uint256 constant _totalSupply = 1000;

    // token Bankが預かっているTokenの少量
    uint256 private _bankTotalDEposit;
    // contractのオーナーアドレス
    address public owner;

    //アカウント別にToke残高
    mapping(address => uint256) private _balances;

    //TokenBankが預かっているTokenzanndaka
    mapping(address => uint256) private _tokenBankBalances;
}
