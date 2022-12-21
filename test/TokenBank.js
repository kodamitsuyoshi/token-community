const { expect } = require("chai");
const { ethers } = require("hardhat");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("TokenBank", function () {

    let TokenBank;
    let tokenBank;
    const name = "TokenBank";
    const symbol = "TBK";
    let owner;
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    let addr1;
    let addr2;
    let addr3

    beforeEach(async function () {
        [owner, addr1, addr2, addr3] = await ethers.getSigners();

        TokenBank = await ethers.getContractFactory("TokenBank");
        tokenBank = await TokenBank.deploy(name, symbol);
        await tokenBank.deployed();

    });

    describe("Deploy", function () {
        it("トークンと名前がセットされるべき", async function () {
            expect(await tokenBank.name()).to.equal(name);
            expect(await tokenBank.symbol()).to.equal(symbol);
        });
        it("デプロイアドレスがオーナーに割り当てられるべき", async function () {
            expect(await tokenBank.owner()).to.equal(owner.address);
        });
        it("ownerに総額が割り当てるべき", async function () {
            const onwerBalance = await tokenBank.balanceOf(owner.address);
            expect(await tokenBank.totalSupply()).to.equal(onwerBalance);
        });

        it("Deployしたときトークン総額は0であるべき", async function () {
            expect(await tokenBank.bankTotalDeposit()).to.equal(0);
        });
    });

    describe("Address間トランザクション", function () {


        beforeEach(async function () {
            await tokenBank.transfer(addr1.address, 500);

        });


        it("トークン移転はされるべき", async function () {
            const startAddr1Balance = await tokenBank.balanceOf(addr1.address);
            const startAddr2Balance = await tokenBank.balanceOf(addr2.address);
            await tokenBank.connect(addr1).transfer(addr2.address, 100);
            const endAddr1Balance = await tokenBank.balanceOf(addr1.address);
            const endAddr2Balance = await tokenBank.balanceOf(addr2.address);
            expect(endAddr1Balance).to.equal(startAddr1Balance.sub(100));
            expect(endAddr2Balance).to.equal(startAddr2Balance.add(100));


            //
        });
        it("ゼロアドレス宛の移転は失敗されるべき", async function () {
            expect(tokenBank.connect(addr1).transfer(zeroAddress, 100)).to.be.revertedWith("Zero address cannot be specified for 'to'!");
        });
        it("残高不足のときは移転に失敗されるべき", async function () {
            expect(tokenBank.connect(addr1).transfer(addr2.address, 501)).to.be.revertedWith("Insufficient balance!!");
        });

        it("移転後にはTransferイベントが発行されるべき", async function () {

            await expect(tokenBank.connect(addr1).transfer(addr2.address, 201)).to.emit(tokenBank, "TokenTransfer").withArgs(addr1.address, addr2.address, 201);
        });
    });

    describe("BANKトランザクション", function () {

        beforeEach(async function () {
            await tokenBank.transfer(addr1.address, 500);
            await tokenBank.transfer(addr2.address, 200);
            await tokenBank.transfer(addr3.address, 100);
            await tokenBank.connect(addr1).deposit(100);
            await tokenBank.connect(addr2).deposit(200);
            // await tokenBank.connect(addr3).deposit(100);
        });


        it("トークン預け入れができるべき", async function () {
            //残高を確認
            const addr1Balance = await tokenBank.balanceOf(addr1.address)
            expect(addr1Balance).to.equal(400);

            const addr1bankBalance = await tokenBank.bankBalanceOf(addr1.address)
            expect(addr1bankBalance).to.equal(100);

        })
        it("トークン預け入れ後トークンを移転できるべき", async function () {
            const startAddr1Balance = await tokenBank.balanceOf(addr1.address);
            const startAddr2Balance = await tokenBank.balanceOf(addr2.address);
            await tokenBank.connect(addr1).transfer(addr2.address, 100);
            const endAddr1Balance = await tokenBank.balanceOf(addr1.address);
            const endAddr2Balance = await tokenBank.balanceOf(addr2.address);
            expect(endAddr1Balance).to.equal(startAddr1Balance.sub(100));
            expect(endAddr2Balance).to.equal(startAddr2Balance.add(100));
        })
        it("預け入れ後にはTokenDepositイベントが実行されるべき", async function () {

            await expect(tokenBank.connect(addr1).deposit(100)).to.emit(tokenBank, "TokenDeposit").withArgs(addr1.address, 100);
        })

        it("Token引き出しが実行されるべき", async function () {
            // expect().to.expect(0);
            const startBanakBalance = await tokenBank.connect(addr1).bankBalanceOf(addr1.address)
            const startTotalBanakBalance = await tokenBank.connect(addr1).bankTotalDeposit()

            await tokenBank.connect(addr1).withdraw(100)

            const endBanakBalance = await tokenBank.connect(addr1).bankBalanceOf(addr1.address)
            const endTotalBanakBalance = await tokenBank.connect(addr1).bankTotalDeposit()

            expect(endBanakBalance).to.equal(startBanakBalance.sub(100));
            expect(endTotalBanakBalance).to.equal(startTotalBanakBalance.sub(100));


        });
        it("預け入れているトークン数が不足しているとき 引き出し失敗すべき", async function () {
            await expect(tokenBank.connect(addr1).withdraw(101)).to.be.revertedWith("An amount greater tahn your tokenBank balance!");;
        });
        it("Token引き出し後TokenWithdrawイベントが実行されるべき", async function () {

            await expect(tokenBank.connect(addr1).withdraw(100)).to.emit(tokenBank, "TokenWithdraw").withArgs(addr1.address, 100);

        });
    });
});