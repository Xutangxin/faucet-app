# faucet app (hardhat + react + wagmi)

### 步驟

1. npm install & cd frontend npm install（hardhat 依赖 & 前端依赖）
2. 部署合约 npx hardhat run scripts/deploy.js --network sepolia
3. 从 Hardhat 编译后的 artifacts/contracts/Faucet.sol/Faucet.json 中复制 abi 部分，保存到 frontend/src/abi 下的 Faucet.json
4. 把部署的合约地址填到 frontend/src/config 里的 FAUCET_ADDRESS 和 TOKEN_ADDRESS
5. 启动前端 npm run dev
