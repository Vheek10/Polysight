/** @format */

// app/api/auth/check-user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();

		if (!email) {
			return NextResponse.json({ error: "Email is required" }, { status: 400 });
		}

		// Check if user exists with this email
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

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
