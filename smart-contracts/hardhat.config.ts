import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "./tasks/create";
import "./tasks/mint";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      chainId: 1337
    },
  },
};

export default config;

//npx hardhat mint --collection 0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e --recipient 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --id 2 --network localhost
//npx hardhat create --name aa --symbol aaa --network localhost