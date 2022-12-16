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
    uint256 private _bankTotalDeposit;
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

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        owner = msg.sender;

        _balances[owner] = _totalSupply;
    }

    ///@dev Tokenの名前を返す
    function name() public view returns (string memory) {
        return _name;
    }

    ///@dev TokenのSymbolを返す
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    ///@dev TokenのtotalSupplyを返す
    function totalSupply() public pure returns (uint256) {
        return _totalSupply;
    }

    ///@dev 指定アカウントのToken残高を返す
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    ///@dev Tokenを移転する
    function transfer(address to, uint256 amount) public {
        address from = msg.sender;
        _transfer(from, to, amount);
    }

    // @dev実際の移転処理
    function _transfer(address from, address to, uint256 amount) internal {
        require(to != address(0), "Zero address cannot be specified for 'to'!");
        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "Insufficient balance!!");

        _balances[from] = fromBalance - amount;
        _balances[to] += amount;
        emit TokenTransfer(from, to, amount);
    }

    ///@dev TokenBankの預かっているTokenの総額を返す
    function bankTotalDeposit() public view returns (uint256) {
        return _bankTotalDeposit;
    }

    ///@dev TokenBankが預かっている指定のアカウントアドレスのTokenの総額を返す
    function bankBalanceOf(address acccount) public view returns (uint256) {
        return _tokenBankBalances[acccount];

    }
    ///@dev Tokenを預ける
    function deposit(uint256 amount) public {
        address from = msg.sender;
        address to = owner;

        _transfer(from, to , amount);
        _tokenBankBalances[from] +=amount;
        _bankTotalDeposit += amount; 
        emit TokenDeposit(from, amount);
    } 
}
