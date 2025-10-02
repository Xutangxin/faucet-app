import { useEffect, useState, useCallback } from "react";
import {
  useAccount,
  useReadContracts,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatUnits } from "viem";
import { FAUCET_ADDRESS, TOKEN_ADDRESS, tokenAbi, FaucetABI } from "../config";

export default function useFaucet() {
  return {};
}
