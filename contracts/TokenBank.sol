// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract TokenBank {
    ///@dev Token Name
    string private _name;
    ///@dev Token Symbol
    string private _symbol;

    ///@dev Token totla suply
    uint256 constant _totalSupply = 1000;

    ///@dev token Bankが預かっているTokenの少量
    uint256 private _bankTotalDEposit;
    ///@dev contractのオーナーアドレス
    address public owner;

    ///@dev アカウント別にToke残高
    mapping(address => uint256) private _balances;

    ///@dev TokenBankが預かっているTokenzanndaka
    mapping(address => uint256) private _tokenBankBalances;

    ///@dev Token移転時のイベント
    event TokenTransfer(
        address indexed from,
        address indexed to,
        uint256 amount
    );

    ///@dev Token預け入れ時のイベント
    event TokenDeposit(address indexed from, uint256 amount);
    ///@dev Token引き出し時のイベント
    event TokenWithdraw(address indexed from, uint256 amount);
}
