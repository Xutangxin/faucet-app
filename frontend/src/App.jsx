import { chainConfig } from "./chainConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { WagmiProvider } from "wagmi";
import UpgradedFaucet from "./components/UpgradedFaucet";

function App() {
  return (
    <WagmiProvider config={chainConfig}>
      <QueryClientProvider client={new QueryClient()}>
        <div className="max-w-[700px] mx-auto my-[50px]">
          <UpgradedFaucet />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
