const hre = require("hardhat");

async function main() {
    const HiFiChain = await hre.ethers.getContractFactory("HiFiChain");

    const hifi = await HiFiChain.deploy();

    await hifi.waitForDeployment();

    console.log("HiFiChain deployed to:", await hifi.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});