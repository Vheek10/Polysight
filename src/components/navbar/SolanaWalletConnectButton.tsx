/** @format */

// components/navbar/SolanaWalletConnectButton.tsx
"use client";

import { SolanaWalletConnectButton as GeneralWalletButton } from "@/components/wallet/SolanaWalletConnectButton";

interface NavbarWalletConnectButtonProps {
	isSignedIn: boolean;
}

export function SolanaWalletConnectButton({
	isSignedIn,
}: NavbarWalletConnectButtonProps) {
	if (!isSignedIn) return null;

	return (
		<div className="hidden sm:flex items-center gap-4">
			<GeneralWalletButton
				// Change "compact" to "default" or remove entirely
				variant="default" // Changed from "compact"
				size="md"
				fullWidth={false}
				showBalance={true}
				showDisconnect={true}
			/>
		</div>
	);
}
