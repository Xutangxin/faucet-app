# faucet app (hardhat + react + wagmi)

### 步骤：

1. npm install & cd frontend npm install（hardhat 依赖 & 前端依赖）
2. 部署合约 npx hardhat run scripts/deploy.js --network sepolia
3. 从 Hardhat 编译后的 artifacts/contracts/Faucet.sol/Faucet.json 中复制 abi 部分，保存到 frontend/src/abi 下的 Faucet.json
4. 把部署的合约地址填到 frontend/src/config 里的 FAUCET_ADDRESS 和 TOKEN_ADDRESS
5. 启动前端 npm run dev

<img width="1391" height="842" alt="image" src="https://github.com/user-attachments/assets/6f3b4342-8650-466e-815b-a962abe6c123" />

<img width="1522" height="422" alt="image" src="https://github.com/user-attachments/assets/0f2ae76f-75cd-44a8-917d-c44d50832749" />

<img width="1530" height="437" alt="image" src="https://github.com/user-attachments/assets/95dc5eda-5a20-46ab-8677-eb2cd7a8d432" />

