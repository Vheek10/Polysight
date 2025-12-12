/** @format */

// app/api/auth/signup/google/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Mock storage (replace with database later)
const users: any[] = [];

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
		const existingUser = users.find((user) => user.email === payload.email);

		if (existingUser) {
			return NextResponse.json(
				{ error: "User already exists" },
				{ status: 409 },
			);
		}

		// Create new user
		const newUser = {
			id: Date.now().toString(),
			email: payload.email!,
			name: payload.name,
			username: username || payload.name?.replace(/\s+/g, "_").toLowerCase(),
			image: payload.picture,
			emailVerified: new Date().toISOString(),
			provider: "google",
			providerId: payload.sub,
			createdAt: new Date().toISOString(),
		};

		users.push(newUser);

		return NextResponse.json({
			success: true,
			user: newUser,
		});
	} catch (error) {
		console.error("Google sign-up error:", error);
		return NextResponse.json({ error: "Sign-up failed" }, { status: 500 });
	}
}
