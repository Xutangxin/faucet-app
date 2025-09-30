const hre = require("hardhat");

async function main() {
  const faucetAddress = "0xBBea815b353D2a49217B4EB6d067580592dC3238";
  const tokenAddress = "0x16b05dB1BFA4e86DBf162D85FC9C4b21c6CcF136";

  await hre.run("verify:verify", {
    address: tokenAddress,
    constructorArguments: [hre.ethers.parseUnits("1000000", 18)],
  });

  await hre.run("verify:verify", {
    address: faucetAddress,
    constructorArguments: [tokenAddress],
  });

  console.log("Contracts verified");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
