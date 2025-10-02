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
} from "wagmi";
import { formatUnits } from "viem";

const { Text } = Typography;

export default function UpgradedFaucet() {
  const [api, contextHolder] = notification.useNotification();

  const { address, isConnected } = useAccount();
  const { connect, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();

  const {
    data: [{ result: bal }, { result: symbol }] = [{}, {}],
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
    if (connectError) {
      api.error({
        message: "连接失败",
        description: connectError.message,
      });
    }
  }, [connectError]);

  // const requestTokens = async () => {
  //   try {
  //     setTxLoading(true);
  //     const provider = new ethers.BrowserProvider(window.ethereum);
  //     const signer = await provider.getSigner();
  //     const faucet = new ethers.Contract(FAUCET_ADDRESS, FaucetABI.abi, signer);

  //     const left = await faucet.remainingClaims(signer.address);
  //     const canClaim = parseInt(left.toString()) > 0;
  //     if (!canClaim) {
  //       api.error({
  //         message: "操作失败",
  //         description: "暂时还不能领取",
  //       });
  //       setTxLoading(false);
  //       return;
  //     }

  //     const tx = await faucet.requestTokens();
  //     api.success({
  //       message: "交易中",
  //       description: (
  //         <Button
  //           type="link"
  //           icon={<LinkOutlined />}
  //           href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
  //           target="_blank"
  //         >
  //           在 Etherscan 上查看
  //         </Button>
  //       ),
  //     });
  //     await tx.wait();
  //     api.success({
  //       message: "交易完成",
  //     });
  //     setTxLoading(false);
  //     getBalance(signer);
  //   } catch (error) {
  //     console.error("error: ", error);
  //     setTxLoading(false);
  //     api.error({
  //       message: "操作失败",
  //       description: error.message,
  //     });
  //   }
  // };

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
            {balanceLoading ? "加载中..." : `${formatUnits(bal, 18)} ${symbol}`}
          </p>
        </div>
        <Button disabled={!isConnected} loading={false}>
          {isConnected ? "交易中" : "领取代币"}
        </Button>
      </Card>
    </>
  );
}
