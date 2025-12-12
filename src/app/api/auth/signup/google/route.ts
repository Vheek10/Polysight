/** @format */

// app/api/auth/signup/google/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { mockUsers, addMockUser, type MockUser } from "@/lib/mockUsers";

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

		// Check if user already exists in mock data
		const existingUser = mockUsers.find((user) => user.email === payload.email);

		if (existingUser) {
			return NextResponse.json(
				{ error: "User already exists" },
				{ status: 409 },
			);
		}

		// Create new user using mock data format
		const newUser: MockUser = {
			id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			email: payload.email!,
			name: payload.name || "",
			username:
				username ||
				payload.name?.replace(/\s+/g, "_").toLowerCase() ||
				`user_${Date.now()}`,
			image: payload.picture || "",
			emailVerified: new Date().toISOString(),
			provider: "google",
			providerId: payload.sub,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			profile: {
				balance: 1000,
				portfolioValue: 1000,
				watchlist: [],
				transactions: [],
			},
		};

		// Add user to mock data
		addMockUser(newUser);

		// Return user data
		const { profile, ...userWithoutProfile } = newUser;

		return NextResponse.json({
			success: true,
			user: userWithoutProfile,
		});
	} catch (error) {
		console.error("Google sign-up error:", error);
		return NextResponse.json({ error: "Sign-up failed" }, { status: 500 });
	}
}
