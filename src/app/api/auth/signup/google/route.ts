/** @format */

// app/api/auth/signup/google/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/prisma";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: NextRequest) {
	try {
		const { token, username } = await request.json();

		// Verify Google token
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		if (!payload) {
			return NextResponse.json(
				{ error: "Invalid Google token" },
				{ status: 401 },
			);
		}

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email: payload.email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "User already exists" },
				{ status: 409 },
			);
		}

		// Create new user
		const user = await prisma.user.create({
			data: {
				email: payload.email!,
				name: payload.name,
				username: username || payload.name?.replace(/\s+/g, "_").toLowerCase(),
				image: payload.picture,
				emailVerified: new Date(),
				provider: "google",
				providerId: payload.sub,
			},
		});

		// Create user profile
		await prisma.userProfile.create({
			data: {
				userId: user.id,
				balance: 1000, // Starting balance
				portfolioValue: 1000,
			},
		});

		// Return user data (excluding sensitive info)
		const { password, ...userWithoutPassword } = user;

		return NextResponse.json({
			success: true,
			user: userWithoutPassword,
		});
	} catch (error) {
		console.error("Google sign-up error:", error);
		return NextResponse.json({ error: "Sign-up failed" }, { status: 500 });
	}
}
