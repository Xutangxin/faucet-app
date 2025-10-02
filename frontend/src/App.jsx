// import Faucet from "./components/Faucet";
import { chainConfig } from "./chainConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import UpgradedFaucet from "./components/UpgradedFaucet";
import { WagmiProvider } from "wagmi";

function App() {
  return (
    <WagmiProvider config={chainConfig}>
      <QueryClientProvider client={new QueryClient()}>
        <div className="max-w-[700px] mx-auto my-[50px]">
          {/* <Faucet /> */}
          <UpgradedFaucet />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
