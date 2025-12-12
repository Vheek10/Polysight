/** @format */

// app/api/auth/check-user/route.ts
import { NextRequest, NextResponse } from "next/server";

// Mock user database (replace with real database later)
const mockUsers = [
	{ id: "1", email: "test@example.com", username: "testuser" },
];

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();

		if (!email) {
			return NextResponse.json({ error: "Email is required" }, { status: 400 });
		}

		// Check if user exists in mock data
		const existingUser = mockUsers.find((user) => user.email === email);

		return NextResponse.json({
			exists: !!existingUser,
		});
	} catch (error) {
		console.error("Check user error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
