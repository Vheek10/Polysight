/** @format */

// app/api/auth/google/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: NextRequest) {
	try {
		const { token } = await request.json();

		// Verify the ID token with Google
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		if (!payload) {
			return NextResponse.json({ error: "Invalid token" }, { status: 401 });
		}

		// Extract user information
		const user = {
			id: payload.sub,
			email: payload.email,
			name: payload.name,
			picture: payload.picture,
			emailVerified: payload.email_verified,
		};

		// Here you would typically:
		// 1. Check if user exists in your database
		// 2. Create user if doesn't exist
		// 3. Create a session/token for your app
		// 4. Return user data

		return NextResponse.json({
			success: true,
			user,
		});
	} catch (error) {
		console.error("Google authentication error:", error);
		return NextResponse.json(
			{ error: "Authentication failed" },
			{ status: 401 },
		);
	}
}
