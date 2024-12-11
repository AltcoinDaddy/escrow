import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  const Escrow = await ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy();

  console.log("Escrow deployed to:", escrow.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 