const axios = require('axios');
const { ethers } = require('ethers');

// Replace with the deployed contract address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const JSON_RPC_PROVIDER = "http://127.0.0.1:8545";

const ABI = [
    "function updateExchangeRate(uint256 _rate) public"
];

async function main() {
    console.log("🤖 Oracle Service Started...");

    const provider = new ethers.JsonRpcProvider(JSON_RPC_PROVIDER);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    try {
        console.log("Fetching ETH Price from Internet...");
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const price = Math.floor(response.data.ethereum.usd);

        console.log(`✅ Current ETH Price: $${price}`);

        console.log("Pushing data to Smart Contract...");
        const tx = await contract.updateExchangeRate(price);
        await tx.wait();

        console.log("🎉 Oracle Update Complete! Data is now on-chain.");

    } catch (error) {
        console.error("❌ Oracle Error:", error.message);
    }
}

main();