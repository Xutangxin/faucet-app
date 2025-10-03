import { useEffect } from "react";
import { Button, Card, notification } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { useAccount, useConnect, useDisconnect, injected } from "wagmi";
import useFaucet from "../hooks/useFaucet";
import AccountInfo from "./AccountInfo";

export default function UpgradedFaucet2() {
  const [api, contextHolder] = notification.useNotification();

  const { connect, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  const { balance, remains, loading, writeError, hash, isSuccess, claim } =
    useFaucet();

  useEffect(() => {
    if (!connectError) return;
    api.error({
      message: "连接失败",
      description: connectError.message,
    });
  }, [connectError]);

  useEffect(() => {
    if (!writeError) return;
    api.error({
      message: "操作失败",
      description: writeError.message,
    });
  }, [writeError]);

  useEffect(() => {
    if (!isSuccess) return;
    api.success({
      message: "交易完成",
    });
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

        <AccountInfo address={address} balance={balance} />

        <Button
          disabled={!isConnected || remains === 0n}
          onClick={claim}
          loading={loading}
        >
          {loading ? "交易中" : "领取代币"}
        </Button>
      </Card>
    </>
  );
}
