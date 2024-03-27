const { Contract, ContractFactory, utils, BigNumber, constants } = require('ethers')

const artifacts = {
    ERC20SimpleTokenArtifact: require('../artifacts/contracts/ERC20SimpleToken.sol/ERC20SimpleToken.json'),
    ERC1155SimpleTokenArtifact: require('../artifacts/contracts/ERC1155SimpleToken.sol/ERC1155SimpleToken.json'),
    CloneFactoryERC20Artifact: require('../artifacts/contracts/CloneFactoryERC20.sol/CloneFactoryERC20.json')
};
const { ethers } = require('hardhat')

async function main() {
    const [owner] = await ethers.getSigners()

    const ERC20SimpleToken = new ContractFactory(
        artifacts.ERC20SimpleTokenArtifact.abi, 
        artifacts.ERC20SimpleTokenArtifact.bytecode, 
        owner)
    const erc20SimpleToken = await ERC20SimpleToken.deploy('TestTest', 'TT', 18)
    console.log('ERC20SimpleToken', erc20SimpleToken.address)

    const ERC1155SimpleToken = new ContractFactory(
        artifacts.ERC1155SimpleTokenArtifact.abi, 
        artifacts.ERC1155SimpleTokenArtifact.bytecode, 
        owner)
    const erc1155SimpleToken = await ERC1155SimpleToken.deploy()
    console.log('ERC1155SimpleToken', erc1155SimpleToken.address)

    const CloneFactoryERC20 = new ContractFactory(
        artifacts.CloneFactoryERC20Artifact.abi, 
        artifacts.CloneFactoryERC20Artifact.bytecode, 
        owner)
    const cloneFactoryERC20 = await CloneFactoryERC20.deploy(erc20SimpleToken.address)
    console.log('CloneFactoryERC20', cloneFactoryERC20.address)
}

// Run the script
// npx hardhat run --network localhost scripts/00_deployAll.js

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });