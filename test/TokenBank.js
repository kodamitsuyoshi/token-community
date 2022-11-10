const { expect } = require("chai");
const { ethers } = require("hardhat");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");


describe("TokenBank", function () {

    let TokenBank;
    let tokenBank;
    const name = "TokenBank";
    const symbol = "TBK";
    let owner;


    beforeEach(async function () {
        [owner] = await ethers.getSigners();

        TokenBank = await ethers.getContractFactory("TokenBank");
        tokenBank = await TokenBank.deploy(name, symbol);
        await tokenBank.deployed();

    });

    describe("Deploy", function () {
        it("トークンと名前がセットされるべき",async function(){
            expect(await tokenBank.name()).to.equal(name);
            expect(await tokenBank.symbol()).to.equal(symbol);
        });
        it("デプロイアドレスがオーナーに割り当てられるべき",async function(){
            expect(await tokenBank.owner()).to.equal(owner.address);
        });
        it("ownerに総額が割り当てるべき",async function(){
            const onwerBalance = await tokenBank.balanceOf(owner.address);
            expect(await tokenBank.totalSupply()).to.equal(onwerBalance);
        });
    });


});