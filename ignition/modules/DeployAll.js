const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeployAll", (m) => {
    const simpleToken = m.contract("ERC20SimpleToken", ["TestTest", "TT", 18]);
  
    const multiToken = m.contract('ERC1155SimpleToken', []);

    const factory = m.contract('CloneFactoryERC20', [simpleToken]);
  
    return { simpleToken, multiToken, factory };
  });