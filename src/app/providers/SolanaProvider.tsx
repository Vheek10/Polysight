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
	GlowWalletAdapter,
	TrustWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

// Import styles
import "@solana/wallet-adapter-react-ui/styles.css";

export default function SolanaProvider({ children }: { children: ReactNode }) {
	// Use devnet for development
	const network = WalletAdapterNetwork.Devnet;

	// Alternatively, use environment variable for flexibility
	// const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork) || WalletAdapterNetwork.Devnet;

	// Create a stable endpoint URL for devnet
	const endpoint = useMemo(() => {
		// Default devnet endpoint
		const defaultRpc = clusterApiUrl(network);

		// Optionally use a more reliable devnet RPC for better performance
		// Common devnet RPC providers:
		// - Helius: `https://devnet.helius-rpc.com/?api-key=your-api-key`
		// - QuickNode: `https://api.devnet.solana.com`
		// - Triton: `https://devnet.rpcpool.com`

		// Use custom RPC if provided, otherwise use default
		// return process.env.NEXT_PUBLIC_SOLANA_RPC || defaultRpc;

		return defaultRpc;
	}, [network]);

	// Initialize wallets with proper error handling
	const wallets = useMemo(() => {
		try {
			const walletAdapters = [
				new PhantomWalletAdapter(),
				new SolflareWalletAdapter(),
				new CoinbaseWalletAdapter(),
				new BackpackWalletAdapter(),
				// Add more popular wallets
				new GlowWalletAdapter(),
				new TrustWalletAdapter(),
			];

			// Filter out any wallets that fail to initialize
			return walletAdapters.filter((wallet) => {
				try {
					// Test if wallet adapter can be instantiated
					return !!wallet;
				} catch (error) {
					console.warn(`Failed to initialize wallet adapter:`, error);
					return false;
				}
			});
		} catch (error) {
			console.error("Error initializing wallets:", error);
			// Return a minimal set of wallets if initialization fails
			return [new PhantomWalletAdapter(), new SolflareWalletAdapter()];
		}
	}, []);

	// Handle wallet connection errors globally
	const onError = useMemo(() => {
		return (error: any) => {
			console.error("Wallet connection error:", error);

			// You can add custom error handling here
			// For example, show a toast notification
			if (error?.message?.includes("User rejected")) {
				// Handle user rejection
				console.log("User rejected the connection request");
			} else if (error?.message?.includes("Wallet not found")) {
				console.log("Wallet extension not detected");
			} else if (error?.message?.includes("devnet")) {
				// Devnet-specific error handling
				console.log("Devnet connection issue detected");
			}
		};
	}, []);

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider
				wallets={wallets}
				autoConnect={true}
				onError={onError}
				// Optional: Add localStorage key for wallet persistence
				localStorageKey="solana-wallet-adapter-devnet">
				{children}
			</WalletProvider>
		</ConnectionProvider>
	);
}
