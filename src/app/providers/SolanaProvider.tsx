/** @format */

"use client";

import { ReactNode, useMemo } from "react";
import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react";

import {
	PhantomWalletAdapter,
	SolflareWalletAdapter,
	CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

export default function SolanaProvider({ children }: { children: ReactNode }) {
	const network = WalletAdapterNetwork.Mainnet;

	const endpoint = useMemo(() => clusterApiUrl(network), [network]);

	const wallets = useMemo(
		() => [
			new PhantomWalletAdapter(),
			new SolflareWalletAdapter(),
			new CoinbaseWalletAdapter(),
			new BackpackWalletAdapter(),
		],
		[],
	);

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider
				wallets={wallets}
				autoConnect>
				{children}
			</WalletProvider>
		</ConnectionProvider>
	);
}
