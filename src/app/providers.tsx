/** @format */

// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
	PhantomWalletAdapter,
	SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { ThemeProvider } from "next-themes";
import { ReactNode, useMemo } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000,
			retry: 1,
		},
	},
});

export function Providers({ children }: { children: ReactNode }) {
	const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
	const wallets = useMemo(
		() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
		[],
	);

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange>
			<QueryClientProvider client={queryClient}>
				<ConnectionProvider endpoint={endpoint}>
					<WalletProvider
						wallets={wallets}
						autoConnect>
						<WalletModalProvider>{children}</WalletModalProvider>
					</WalletProvider>
				</ConnectionProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}
