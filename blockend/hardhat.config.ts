import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

let ETHERSCAN_API = "CHANGE_ME";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url:
        "https://eth-goerli.g.alchemy.com/v2/_ARqf35oxzZ7iUkNAXTYnacKbgvFrwvp",
      accounts: [
        "PRIVATE_KEY",
      ],
      chainId: 5,
    },
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API,
    },
  },
  solidity: "0.8.18",
};

export default config;
