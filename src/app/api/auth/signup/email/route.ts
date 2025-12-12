/** @format */

// app/api/auth/signup/email/route.ts
import { NextRequest, NextResponse } from "next/server";

// Mock storage
const users: any[] = [];

export async function POST(request: NextRequest) {
	try {
		const { email, username, password } = await request.json();

		// Validate input
		if (!email || !username || !password) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Check if user already exists
		const existingUser = users.find(
			(user) => user.email === email || user.username === username,
		);

		if (existingUser) {
			return NextResponse.json(
				{ error: "Email or username already taken" },
				{ status: 409 },
			);
		}

		// Create new user (without password hashing for now)
		const newUser = {
			id: Date.now().toString(),
			email,
			username,
			provider: "email",
			createdAt: new Date().toISOString(),
		};

		users.push(newUser);

		return NextResponse.json({
			success: true,
			user: newUser,
		});
	} catch (error) {
		console.error("Email sign-up error:", error);
		return NextResponse.json({ error: "Sign-up failed" }, { status: 500 });
	}
}
