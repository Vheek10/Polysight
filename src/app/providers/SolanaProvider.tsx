/** @format */

// app/providers/SolanaProvider.tsx
"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
	PhantomWalletAdapter,
	SolflareWalletAdapter,
	BackpackWalletAdapter,
	GlowWalletAdapter,
	CoinbaseWalletAdapter,
	WalletConnectWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

// Default styles for wallet modal
import "@solana/wallet-adapter-react-ui/styles.css";

export function SolanaProvider({ children }: { children: React.ReactNode }) {
	// You can set the network to devnet, testnet, or mainnet-beta
	const network = WalletAdapterNetwork.Mainnet;
	const endpoint = useMemo(() => clusterApiUrl(network), [network]);

	// Supported wallets
	const wallets = useMemo(
		() => [
			new PhantomWalletAdapter(),
			new SolflareWalletAdapter(),
			new BackpackWalletAdapter(),
			new GlowWalletAdapter(),
			new CoinbaseWalletAdapter(),
			new WalletConnectWalletAdapter({
				network,
				options: {
					projectId:
						process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
						"demo-project-id",
					metadata: {
						name: "Polysight",
						description: "Predict • Trade • Win",
						url: "https://polysight.com",
						icons: ["https://polysight.com/icon.png"],
					},
				},
			}),
		],
		[network],
	);

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider
				wallets={wallets}
				autoConnect>
				<WalletModalProvider>{children}</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
}
