/** @format */

// app/api/auth/signup/wallet/route.ts
import { NextRequest, NextResponse } from "next/server";

// Mock storage
const users: any[] = [];

export async function POST(request: NextRequest) {
	try {
		const { walletAddress, username } = await request.json();

		if (!walletAddress) {
			return NextResponse.json(
				{ error: "Wallet address is required" },
				{ status: 400 },
			);
		}

		// Check if wallet already registered
		const existingUser = users.find(
			(user) =>
				user.walletAddress === walletAddress || user.username === username,
		);

		if (existingUser) {
			return NextResponse.json(
				{ error: "Wallet or username already registered" },
				{ status: 409 },
			);
		}

		// Create new user with wallet
		const newUser = {
			id: Date.now().toString(),
			username: username || `wallet_${walletAddress.slice(0, 8)}`,
			walletAddress,
			provider: "wallet",
			createdAt: new Date().toISOString(),
		};

		users.push(newUser);

		return NextResponse.json({
			success: true,
			user: newUser,
		});
	} catch (error) {
		console.error("Wallet sign-up error:", error);
		return NextResponse.json(
			{ error: "Wallet sign-up failed" },
			{ status: 500 },
		);
	}
}
