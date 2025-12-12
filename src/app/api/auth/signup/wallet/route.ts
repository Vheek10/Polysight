/** @format */

// app/api/auth/signup/wallet/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [{ walletAddress }, { username }],
			},
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "Wallet or username already registered" },
				{ status: 409 },
			);
		}

		// Create new user with wallet
		const user = await prisma.user.create({
			data: {
				username: username || `wallet_${walletAddress.slice(0, 8)}`,
				walletAddress,
				provider: "wallet",
			},
		});

		// Create user profile
		await prisma.userProfile.create({
			data: {
				userId: user.id,
				balance: 1000,
				portfolioValue: 1000,
			},
		});

		return NextResponse.json({
			success: true,
			user,
		});
	} catch (error) {
		console.error("Wallet sign-up error:", error);
		return NextResponse.json(
			{ error: "Wallet sign-up failed" },
			{ status: 500 },
		);
	}
}
