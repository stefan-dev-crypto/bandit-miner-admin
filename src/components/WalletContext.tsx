// src/components/WalletContext.tsx
import React, { FC, useMemo, ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

interface WalletContextProviderProps {
  children: ReactNode;
  network?: WalletAdapterNetwork;
  endpoint?: string;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({
  children,
  endpoint = "https://devnet.helius-rpc.com/?api-key=75eb1c68-327f-4ff6-bb2b-669e45282ba3",
}) => {
  const wallets = useMemo(
    // () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    () => [new PhantomWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};
