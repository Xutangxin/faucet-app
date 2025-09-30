import { useState } from "react";
import { ethers } from "ethers";
import FaucetABI from "../abi/Faucet.json";
import { FAUCET_ADDRESS, TOKEN_ADDRESS } from "../config";

function Faucet() {
  const [account, setAccount] = useState("");
  const [status, setStatus] = useState("");
  const [balance, setBalance] = useState("");

  const connectWallet = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    setAccount(await signer.getAddress());

    const contract = new ethers.Contract(
      TOKEN_ADDRESS,
      [
        "function balanceOf(address) view returns (uint256)",
        "function decimals() view returns (uint8)",
      ],
      signer
    );

    const raw = await contract.balanceOf(signer.getAddress());
    const dec = await contract.decimals();
    setBalance(ethers.formatUnits(raw, dec));
  };

  const requestTokens = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const faucet = new ethers.Contract(FAUCET_ADDRESS, FaucetABI.abi, signer);

      const claimed = await faucet.hasClaimed(signer.getAddress());
      if (claimed) {
        alert("已领取过！");
        return;
      }

      setStatus("交易中...");
      const tx = await faucet.requestTokens();
      await tx.wait();
      setStatus("领取成功！");
    } catch (error) {
      setStatus("");
      console.error("error: ", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>Sepolia 代币水龙头</h1>
      <button onClick={connectWallet}>连接钱包</button>
      <p>账户：{account || "未连接"}</p>
      <p>余额：{balance}</p>

      <button onClick={requestTokens} disabled={!account}>
        领取代币
      </button>
      <p>{status}</p>
    </div>
  );
}

export default Faucet;
