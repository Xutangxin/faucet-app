import { useEffect, useCallback } from "react";
import {
  useAccount,
  useReadContracts,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatUnits } from "viem";
import { FAUCET_ADDRESS, TOKEN_ADDRESS, tokenAbi } from "../config";
import FaucetABI from "../abi/Faucet.json";

export default function useFaucet() {
  const { address, isConnected } = useAccount();

  // 获取余额
  const {
    data: balanceData = [{ result: 0n }, { result: "MTK" }],
    refetch: refetchBalance,
  } = useReadContracts({
    contracts: [
      {
        address: TOKEN_ADDRESS,
        abi: tokenAbi,
        functionName: "balanceOf",
        args: [address],
      },
      {
        address: TOKEN_ADDRESS,
        abi: tokenAbi,
        functionName: "symbol",
      },
    ],
    enabled: isConnected,
  });
  const [bal, symbol] = [balanceData[0].result, balanceData[1].result];

  // 获取剩余领取数
  const { data: remains, refetch: refetchRemains } = useReadContract({
    abi: FaucetABI.abi,
    address: FAUCET_ADDRESS,
    functionName: "remainingClaims",
    args: [address],
    enabled: isConnected,
  });

  // 领取token
  const {
    writeContractAsync,
    data: hash,
    isPending: writePending,
    error: writeError,
  } = useWriteContract();
  const { isSuccess, isLoading: waitLoading } = useWaitForTransactionReceipt({
    hash,
  });

  // 交易后刷新数据
  useEffect(() => {
    if (isSuccess) {
      refetchBalance();
      refetchRemains();
    }
  }, [isSuccess]);

  const claim = useCallback(async () => {
    try {
      console.log("remains: ", remains);
      if (!isConnected) throw new Error("钱包未连接");
      if (remains === 0n) throw new Error("今日已领完");
      await writeContractAsync({
        address: FAUCET_ADDRESS,
        abi: FaucetABI.abi,
        functionName: "requestTokens",
      });
    } catch (error) {
      console.error("error: ", error);
    }
  }, [isConnected, remains, writeContractAsync]);

  return {
    balance: isConnected ? `${formatUnits(bal, 18)} ${symbol}` : "--",
    loading: writePending || waitLoading,
    writeError,
    remains,
    hash,
    isSuccess,
    claim,
  };
}
