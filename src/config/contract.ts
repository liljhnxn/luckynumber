import deployedData from "./deployedContract.json";

export const LUCKY_NUMBER_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "number",
        type: "uint256",
      },
    ],
    name: "InvalidNumber",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "number",
        type: "uint256",
      },
    ],
    name: "NumberUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getNumber",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "hasNumber",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "number",
        type: "uint256",
      },
    ],
    name: "setNumber",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

/**
 * Returns the configured contract address from environment variable or deployment output.
 */
export function getDefaultContractAddress(): `0x${string}` | "" {
  const envAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.trim();
  if (envAddress && envAddress.startsWith("0x") && envAddress.length === 42) {
    return envAddress as `0x${string}`;
  }

  const deployedAddress = deployedData.contractAddress?.trim();
  if (deployedAddress && deployedAddress.startsWith("0x") && deployedAddress.length === 42) {
    return deployedAddress as `0x${string}`;
  }

  return "";
}
