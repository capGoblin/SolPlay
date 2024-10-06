"use client";
import React from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  // BackpackWalletAdapter,
  // BraveWalletAdapter,
  SolflareWalletAdapter,
  // CloverWalletAdapter,
  // CoinbaseWalletAdapter,
  // ExodusWalletAdapter,
  // GlowWalletAdapter,
  // HuobiWalletAdapter,
  // LedgerWalletAdapter,
  PhantomWalletAdapter,
  // SlopeWalletAdapter,
  // SolletWalletAdapter,
  // SolongWalletAdapter,
  // TorusWalletAdapter,
  // TrustWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

export const SolanaContext: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      // new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
      // new SlopeWalletAdapter(),
      // new TorusWalletAdapter(),
      // new LedgerWalletAdapter(),
      // new BackpackWalletAdapter(),
      // new BraveWalletAdapter(),
      // new CloverWalletAdapter(),
      // new CoinbaseWalletAdapter(),
      // new ExodusWalletAdapter(),
      // new GlowWalletAdapter(),
      // new HuobiWalletAdapter(),
      // new SolletWalletAdapter(),
      // new SolongWalletAdapter(),
      // new TrustWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
