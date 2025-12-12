/** @format */

// app/api/auth/signup/email/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

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
		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [{ email }, { username }],
			},
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "Email or username already taken" },
				{ status: 409 },
			);
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 12);

		// Create new user
		const user = await prisma.user.create({
			data: {
				email,
				username,
				password: hashedPassword,
				provider: "email",
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

		// Return user data (excluding password)
		const { password: _, ...userWithoutPassword } = user;

		return NextResponse.json({
			success: true,
			user: userWithoutPassword,
		});
	} catch (error) {
		console.error("Email sign-up error:", error);
		return NextResponse.json({ error: "Sign-up failed" }, { status: 500 });
	}
}
