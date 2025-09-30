const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(hre.ethers.parseUnits("1000000", 18));
  await token.waitForDeployment();
  console.log("MyToken deployed to:", token.target);

  const Faucet = await hre.ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy(token.target);
  await faucet.waitForDeployment();
  console.log("Faucet deployed to:", faucet.target);

  await token.transfer(faucet.target, hre.ethers.parseUnits("100000", 18));

  console.log("Funding faucet completed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
