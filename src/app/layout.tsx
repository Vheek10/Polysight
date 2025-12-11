/** @format */

// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Polysight - Solana Prediction Markets",
	description: "Trade on future events with Solana prediction markets",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning>
			<body className={`${inter.className} antialiased`}>
				<Providers>
					<div className="min-h-screen bg-background">
						<Navbar />
						<main className="flex-1">{children}</main>
						<Footer />
					</div>
				</Providers>
			</body>
		</html>
	);
}
