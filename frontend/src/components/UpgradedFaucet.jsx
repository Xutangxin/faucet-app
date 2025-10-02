import { useEffect } from "react";
import FaucetABI from "../abi/Faucet.json";
import { tokenAbi, FAUCET_ADDRESS, TOKEN_ADDRESS } from "../config";
import { Button, Card, notification, Typography } from "antd";
import { LinkOutlined } from "@ant-design/icons";

import {
  useAccount,
  useConnect,
  useDisconnect,
  injected,
  useReadContracts,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatUnits } from "viem";

const { Text } = Typography;

export default function UpgradedFaucet() {
  const [api, contextHolder] = notification.useNotification();

  const { connect, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  const {
    writeContract, // 领取token
    data: hash,
    isPending: sendLoading,
    error: txError,
  } = useWriteContract();
  const { isSuccess, isLoading: txLoading } = useWaitForTransactionReceipt({
    hash,
  });
  const tokenLoading = sendLoading || txLoading;

  // 获取剩余领取数
  const { data: remains, refetch: getRemains } = useReadContract({
    abi: FaucetABI.abi,
    address: FAUCET_ADDRESS,
    functionName: "remainingClaims",
    args: [address],
    enabled: false,
  });

  // 获取余额
  const {
    data: [{ result: bal }, { result: symbol }] = [{}, {}],
    refetch: getBalance,
    isPending: balanceLoading,
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
  });

  useEffect(() => {
    if (!connectError) return;
    api.error({
      message: "连接失败",
      description: connectError.message,
    });
  }, [connectError]);

  useEffect(() => {
    if (!txError) return;
    api.error({
      message: "操作失败",
      description: txError.message,
    });
  }, [txError]);

  useEffect(() => {
    if (!isSuccess) return;
    api.success({
      message: "交易完成",
    });
    getBalance();
  }, [isSuccess]);

  useEffect(() => {
    if (!hash) return;
    api.success({
      message: "交易中",
      description: (
        <Button
          type="link"
          icon={<LinkOutlined />}
          href={`https://sepolia.etherscan.io/tx/${hash}`}
          target="_blank"
        >
          在 Etherscan 上查看
        </Button>
      ),
    });
  }, [hash]);

  const getTokens = () => {
    getRemains();
    const val = parseInt((remains || 0).toString());
    console.log("remains count: ", val);
    if (!val) {
      api.error({
        message: "操作失败",
        description: "暂时还不能领取",
      });
      return;
    }
    writeContract({
      abi: FaucetABI.abi,
      address: FAUCET_ADDRESS,
      functionName: "requestTokens",
    });
  };

  return (
    <>
      {contextHolder}
      <Card title="Sepolia 代币水龙头">
        <div>
          {isConnected ? (
            <Button danger onClick={disconnect}>
              断开连接
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => {
                connect({ connector: injected() });
              }}
              icon={<LinkOutlined />}
            >
              连接钱包
            </Button>
          )}
        </div>

        <div className="my-[16px]">
          <p>
            账户：
            <Text copyable={address}>{address || "--"}</Text>
          </p>
          <p>
            余额：
            {isConnected
              ? balanceLoading
                ? "加载中..."
                : `${formatUnits(bal, 18)} ${symbol}`
              : "--"}
          </p>
        </div>
        <Button
          disabled={!isConnected}
          onClick={getTokens}
          loading={tokenLoading}
        >
          {tokenLoading ? "交易中" : "领取代币"}
        </Button>
      </Card>
    </>
  );
}
