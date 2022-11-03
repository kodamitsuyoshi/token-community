const {expect} = require("Chai");
const { ethers } = require("hardhat");


describe("MemberNFTContract",function(){
    it ("トークンと名前とシンボルがセットされるべき",async function(){
        const name = "MemberNFT";
        const symbol  = "MEM";
        const MemberNFT = await ethers.getContractFactory("MemberNFT");
        const memberNFT = await MemberNFT.deploy();
        await  memberNFT.deployed();
        expect(await memberNFT.name()).to.equal(name);
        expect(await memberNFT.symbol()).to.equal(symbol);
        

    });
    it ("デプロイアドレスがownerセットされるべき",async function(){
        const [owner] = await ethers.getSigners();

        const MemberNFT = await ethers.getContractFactory("MemberNFT");
        const memberNFT = await MemberNFT.deploy();
        await memberNFT.deployed();
        

        expect(await memberNFT.owner()).to.equal(owner.address);

    });
});