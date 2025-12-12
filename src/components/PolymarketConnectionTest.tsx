/** @format */

// components/PolymarketConnectionTest.tsx
"use client";

import { useState } from "react";
import { testPolymarketConnection } from "@/lib/marketData";
import { Key, Shield, CheckCircle, XCircle } from "lucide-react";

export default function PolymarketConnectionTest() {
	const [testing, setTesting] = useState(false);
	const [connection, setConnection] = useState<{
		connected: boolean;
		message: string;
	} | null>(null);

	const testConnection = async () => {
		setTesting(true);
		setConnection(null);

		const result = await testPolymarketConnection();
		setConnection(result);
		setTesting(false);
	};

	return (
		<div className="bg-card border border-border rounded-xl p-6">
			<div className="flex items-center gap-3 mb-4">
				<div className="p-2 bg-primary/10 rounded-lg">
					<Key className="h-5 w-5 text-primary" />
				</div>
				<div>
					<h3 className="font-semibold">Polymarket Builder API</h3>
					<p className="text-sm text-muted-foreground">
						Test connection to Polymarket
					</p>
				</div>
			</div>

			<button
				onClick={testConnection}
				disabled={testing}
				className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4">
				{testing ? (
					<>
						<div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
						Testing Connection...
					</>
				) : (
					<>
						<Shield className="h-4 w-4" />
						Test Polymarket Connection
					</>
				)}
			</button>

			{connection && (
				<div
					className={`p-4 rounded-lg ${
						connection.connected
							? "bg-green-500/10 border border-green-500/20"
							: "bg-red-500/10 border border-red-500/20"
					}`}>
					<div className="flex items-start gap-3">
						{connection.connected ? (
							<CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
						) : (
							<XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
						)}
						<div>
							<p className="font-medium">{connection.message}</p>
							{!connection.connected && (
								<p className="text-sm text-muted-foreground mt-2">
									Check your .env.local file for POLYMARKET_BUILDER_API_KEY,
									POLYMARKET_BUILDER_API_SECRET, and
									POLYMARKET_BUILDER_API_PASSPHRASE
								</p>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
