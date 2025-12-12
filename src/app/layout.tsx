/** @format */

// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-space-grotesk",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Polysight - Solana Prediction Markets",
	description: "Trade on future events with Solana prediction markets",
};

export default function RootLayout({
	// FIX: Make sure this is 'export default'
	children,
}: {
	children: React.ReactNode;
}) {
	// Get Google Client ID from environment variables
	const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${inter.variable} ${spaceGrotesk.variable}`}>
			<body className="font-sans antialiased">
				<GoogleOAuthProvider clientId={googleClientId}>
					<Providers>
						<div className="min-h-screen bg-background">
							<Navbar />
							<main className="flex-1">{children}</main>
							<Footer />
						</div>
					</Providers>
				</GoogleOAuthProvider>
			</body>
		</html>
	);
}
