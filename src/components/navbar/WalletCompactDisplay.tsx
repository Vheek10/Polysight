/** @format */

// components/navbar/WalletCompactDisplay.tsx
"use client";

import { Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface WalletCompactDisplayProps {
	className?: string;
	onClick?: () => void;
}

export function WalletCompactDisplay({
	className,
	onClick,
}: WalletCompactDisplayProps) {
	const { connected, publicKey } = useWallet();
	const { connection } = useConnection();
	const [balance, setBalance] = useState<number | null>(null);

	useEffect(() => {
		if (publicKey && connected) {
			fetchBalance();
		}
	}, [publicKey, connected, connection]);

	const fetchBalance = async () => {
		if (!publicKey || !connection) return;

		try {
			const balance = await connection.getBalance(publicKey);
			setBalance(balance);
		} catch (error) {
			console.error("Error fetching balance:", error);
		}
	};

	const formatBalance = (lamports: number | null) => {
		if (!lamports) return "0.0000";
		return (lamports / LAMPORTS_PER_SOL).toFixed(4);
	};

	const truncateAddress = (address: string) => {
		return `${address.slice(0, 4)}...${address.slice(-4)}`;
	};

	if (!connected || !publicKey) return null;

	return (
		<div
			onClick={onClick}
			className={cn(
				"flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 border border-primary/10 hover:bg-primary/10 transition-colors cursor-pointer",
				className,
			)}>
			<div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
			<Wallet className="h-4 w-4 text-primary" />
			<span className="text-sm font-medium text-foreground">
				{truncateAddress(publicKey.toString())}
			</span>
			{balance !== null && (
				<span className="text-xs text-muted-foreground ml-1">
					{formatBalance(balance)} SOL
				</span>
			)}
		</div>
	);
}
