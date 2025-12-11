/** @format */

// components/navbar/SolanaWalletInfo.tsx
import { Copy, Check, ExternalLink, Wallet } from "lucide-react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

interface SolanaWalletInfoProps {
	onCopyWallet: () => void;
	walletCopied: boolean;
}

export function SolanaWalletInfo({
	onCopyWallet,
	walletCopied,
}: SolanaWalletInfoProps) {
	const { publicKey, connected } = useWallet();
	const { connection } = useConnection();
	const [balance, setBalance] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (publicKey && connected) {
			fetchBalance();
		}
	}, [publicKey, connected, connection]);

	const fetchBalance = async () => {
		if (!publicKey || !connection) return;

		try {
			setIsLoading(true);
			const balance = await connection.getBalance(publicKey);
			setBalance(balance);
		} catch (error) {
			console.error("Error fetching balance:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const truncateAddress = (address: string) => {
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	};

	const formatBalance = (lamports: number) => {
		return (lamports / LAMPORTS_PER_SOL).toFixed(4);
	};

	const openExplorer = () => {
		if (!publicKey) return;

		const explorerUrl = `https://explorer.solana.com/address/${publicKey.toString()}`;
		window.open(explorerUrl, "_blank");
	};

	if (!publicKey || !connected) return null;

	return (
		<div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center gap-2">
					<Wallet className="h-4 w-4 text-primary" />
					<span className="text-sm font-medium text-foreground">
						Solana Wallet
					</span>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={openExplorer}
						className="p-1 hover:bg-accent/30 rounded transition-colors cursor-pointer"
						title="View on Explorer">
						<ExternalLink className="h-3 w-3" />
					</button>
					<button
						onClick={onCopyWallet}
						className="p-1 hover:bg-accent/30 rounded transition-colors cursor-pointer"
						title="Copy Address">
						{walletCopied ? (
							<Check className="h-3 w-3 text-green-500" />
						) : (
							<Copy className="h-3 w-3" />
						)}
					</button>
				</div>
			</div>
			<code
				className="block text-xs font-mono bg-background/50 px-3 py-2 rounded border border-border/50 mb-3 cursor-pointer hover:bg-background/70 transition-colors"
				onClick={onCopyWallet}
				title="Click to copy">
				{truncateAddress(publicKey.toString())}
			</code>
			<div className="flex items-center justify-between text-xs">
				<span className="text-muted-foreground">Network:</span>
				<span className="font-medium">Solana Mainnet</span>
			</div>
			<div className="flex items-center justify-between text-xs mt-1">
				<span className="text-muted-foreground">Balance:</span>
				{isLoading ? (
					<div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
				) : (
					<span className="font-medium">{formatBalance(balance)} SOL</span>
				)}
			</div>
		</div>
	);
}
