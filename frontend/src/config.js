export const projectId = "1306cedcc99db7786b11146cf8efbc32"; // WalletConnect项目ID

export const TOKEN_ADDRESS = "0x46e315C2F3FAB6dde6F25c633ac1DDB73dD078C5";
export const FAUCET_ADDRESS = "0x457f9301b879C053708661525c1C635f61117fd8";

export const tokenAbi = [
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ type: "string" }],
    stateMutability: "view",
  },
];
