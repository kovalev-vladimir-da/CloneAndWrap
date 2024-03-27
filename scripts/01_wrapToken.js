const { Contract, utils, BigNumber, constants } = require('ethers')

const artifacts = {
    ERC20SimpleTokenArtifact: require('../artifacts/contracts/ERC20SimpleToken.sol/ERC20SimpleToken.json'),
    ERC1155SimpleTokenArtifact: require('../artifacts/contracts/ERC1155SimpleToken.sol/ERC1155SimpleToken.json'),
    CloneFactoryERC20Artifact: require('../artifacts/contracts/CloneFactoryERC20.sol/CloneFactoryERC20.json')
};

ERC1155SimpleToken = "0x10e273E17842b951755c3Bcf3774CEadbAA419DD"
ERC20SimpleToken = "0x9582E10410DDe6Ad323Ee717690f146a831F3012"
CloneFactoryERC20 = "0xb346672cb57d1e90F3826b66d4472b4F2518C8b4"

async function main() {
    console.log('starting 01_wrapToken.js')

    const [account0, account1] = await ethers.getSigners();
    const provider = waffle.provider;
    owner = account0 //changable, account0 is main dev, account1 is sec dev
    console.log("owner is", owner.address)

    const factoryContract = new Contract(CloneFactoryERC20, artifacts.CloneFactoryERC20Artifact.abi, provider)
    const multiTokenContract = new Contract(ERC1155SimpleToken, artifacts.ERC1155SimpleTokenArtifact.abi, provider)
    const simpleTokenContract = new Contract(ERC20SimpleToken, artifacts.ERC20SimpleTokenArtifact.abi, provider)
    console.log('contracts connected')

    const simpleTokenBalance0 = await  simpleTokenContract.connect(owner).balanceOf(owner.address)
    console.log('owner balance ERC-20 before action', simpleTokenBalance0)

    const multiTokenBalance0 = await  multiTokenContract.connect(owner).balanceOf(owner.address, 0)
    console.log('owner balance ERC-1155 before action', multiTokenBalance0)

    const approval1 = await simpleTokenContract.connect(owner).approve(
        factoryContract.address,
        constants.MaxUint256
    )
    approval1.wait()
    console.log('approval 1 set')

    const approval2 = await multiTokenContract.connect(owner).setApprovalForAll(
        factoryContract.address,
        true
    )
    approval2.wait()
    console.log('approval 2 set')

    const tx = await factoryContract.connect(owner).wrap1155Token(
        ERC1155SimpleToken,
        0,
        10,
        'TestFromV',
        'TFV',
        { gasLimit: utils.hexlify(1000000) }
    )

    await tx.wait()
    console.log('tx', tx)

    const simpleTokenBalance1 = await  simpleTokenContract.connect(owner).balanceOf(owner.address)
    console.log('owner balance ERC-20 after action', simpleTokenBalance1)

    const multiTokenBalance1 = await  multiTokenContract.connect(owner).balanceOf(owner.address, 0)
    console.log('owner balance ERC-1155 after action', multiTokenBalance1)
}

// Run the script
// npx hardhat run --network localhost scripts/01_wrapToken.js

// npx hardhat run --network sepolia scripts/01_wrapToken.js

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });