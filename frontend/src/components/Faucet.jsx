import { useState } from "react";
import { ethers } from "ethers";
import FaucetABI from "../abi/Faucet.json";
import { tokenAbi, FAUCET_ADDRESS, TOKEN_ADDRESS } from "../config";
import { Button, Card, notification, Typography } from "antd";
import { LinkOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function Faucet() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [balanceLoading, setBalanceLoading] = useState("");
  const [txLoading, setTxLoading] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const connectWallet = async () => {
    if (account) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAccount(addr);
      getBalance(signer);
    } catch (error) {
      console.error("error: ", error);
      api.error({
        message: "连接失败",
        description: error.message,
      });
    }
  };

  const getBalance = async (signer) => {
    const contract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, signer);
    setBalanceLoading(true);
    const balance = await contract.balanceOf(signer.getAddress());
    const dec = await contract.decimals();
    // const sym = await contract.symbol();
    const sym = "MTK";
    setBalanceLoading(false);
    setBalance(ethers.formatUnits(balance, dec) + ` ${sym}`);
  };

  const requestTokens = async () => {
    try {
      setTxLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const faucet = new ethers.Contract(FAUCET_ADDRESS, FaucetABI.abi, signer);

      const left = await faucet.remainingClaims(signer.address);
      const canClaim = parseInt(left.toString()) > 0;
      if (!canClaim) {
        api.error({
          message: "操作失败",
          description: "暂时还不能领取",
        });
        setTxLoading(false);
        return;
      }

      const tx = await faucet.requestTokens();
      api.success({
        message: "交易中",
        description: (
          <Button
            type="link"
            icon={<LinkOutlined />}
            href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
            target="_blank"
          >
            在 Etherscan 上查看
          </Button>
        ),
      });
      await tx.wait();
      api.success({
        message: "交易完成",
      });
      setTxLoading(false);
      getBalance(signer);
    } catch (error) {
      console.error("error: ", error);
      setTxLoading(false);
      api.error({
        message: "操作失败",
        description: error.message,
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Card title="Sepolia 代币水龙头">
        <Button type="primary" onClick={connectWallet} icon={<LinkOutlined />}>
          连接钱包
        </Button>

        <div className="my-[16px]">
          <p>
            账户：
            <Text copyable={account}>{account || "--"}</Text>
          </p>
          <p>余额：{balance || `${balanceLoading ? "加载中..." : "--"}`}</p>
        </div>

        <Button onClick={requestTokens} disabled={!account} loading={txLoading}>
          {txLoading ? "交易中" : "领取代币"}
        </Button>
      </Card>
    </>
  );
}
