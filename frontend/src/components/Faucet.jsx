import { useState } from "react";
import { ethers } from "ethers";
import FaucetABI from "../abi/Faucet.json";
import { balanceAbi, FAUCET_ADDRESS, TOKEN_ADDRESS } from "../config";
import { Button, Card, notification, Typography, Spin } from "antd";
const { Text } = Typography;

export default function Faucet() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [balanceLoading, setBalanceLoading] = useState("");
  const [txLoading, setTxLoading] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const connectWallet = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      setAccount(await signer.getAddress());

      const contract = new ethers.Contract(TOKEN_ADDRESS, balanceAbi, signer);

      setBalanceLoading(true);
      const balance = await contract.balanceOf(signer.getAddress());
      const dec = await contract.decimals();
      // const sym = await contract.symbol();
      const sym = "MTK";
      setBalanceLoading(false);

      setBalance(ethers.formatUnits(balance, dec) + ` ${sym}`);
    } catch (error) {
      api.error({
        message: "连接失败",
        description: error.message,
      });
    }
  };

  const requestTokens = async () => {
    try {
      setTxLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const faucet = new ethers.Contract(FAUCET_ADDRESS, FaucetABI.abi, signer);

      const claimed = await faucet.hasClaimed(signer.getAddress());
      if (claimed) {
        api.error({
          message: "操作失败",
          description: "已领取过！",
        });
        setTxLoading(false);
        return;
      }

      const tx = await faucet.requestTokens();
      await tx.wait();
      setTxLoading(false);
    } catch (error) {
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
        <Button type="primary" onClick={connectWallet}>
          🦊 连接钱包
        </Button>

        <div className="my-[16px]">
          <p>
            账户：
            <Text copyable={account}>{account || "--"}</Text>
          </p>
          <Spin spinning={balanceLoading}>
            <p>余额：{balance || "--"}</p>
          </Spin>
        </div>

        <Button onClick={requestTokens} disabled={!account} loading={txLoading}>
          {txLoading ? "交易中" : "领取代币"}
        </Button>
      </Card>
    </>
  );
}
