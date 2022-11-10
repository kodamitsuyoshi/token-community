const fs = require('fs');
const main = async () => {
   
console.log("test");
const addr1 = "0x4138f6d0Cb2C35e3CD92E96569e6e3CD065A9990";
const addr2 = "0x113C4cD40dA0Be93aAfbb97b055aC40651A310eC";
const addr3 = "0xED6A91b1CFaae9882875614170CbC989fc5EfBF0";

const tokenURI1 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata1.json";
const tokenURI2 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata2.json";
const tokenURI3 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata3.json";
const tokenURI4 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata4.json";
const tokenURI5 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata5.json";

//deploy

MemberNFT = await ethers.getContractFactory("MemberNFT");
memberNFT = await MemberNFT.deploy();
await memberNFT.deployed();

console.log(`Contract deployed to https://goerli.etherscan.io/address/${memberNFT.address}`);

//NFT mint 
let tx = await memberNFT.nftMint(addr1, tokenURI1);
await tx.wait();
console.log("NFT#1 minted...");

tx = await memberNFT.nftMint(addr1, tokenURI2);
await tx.wait();
console.log("NFT#2 minted...");

tx = await memberNFT.nftMint(addr2, tokenURI3);
await tx.wait();
console.log("NFT#3 minted...");

tx = await memberNFT.nftMint(addr2, tokenURI4);
await tx.wait();
console.log("NFT#4 minted...");

//contract address 
fs.writeFileSync("./memberNFTContracts.js",
    `
module.exports = "${memberNFT.address}";
`
);


};
const memberNFTdeploy = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
memberNFTdeploy();