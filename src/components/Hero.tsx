/** @format */

// components/Hero.tsx
"use client";

import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero() {
	const router = useRouter();

	const features = [
		{
			icon: <TrendingUp className="h-6 w-6 text-primary" />,
			title: "Active Markets",
			description: "Politics, sports, crypto, finance, and more",
			color: "bg-primary/10",
		},
		{
			icon: <Zap className="h-6 w-6 text-green-500" />,
			title: "Fast Execution",
			description: "Instant trades with Solana-level performance",
			color: "bg-green-500/10",
		},
		{
			icon: <Shield className="h-6 w-6 text-blue-500" />,
			title: "Secure & Transparent",
			description: "Fully decentralized, verifiable outcomes",
			color: "bg-blue-500/10",
		},
	];

	return (
		<section className="py-20">
			<div className="max-w-7xl mx-auto px-4">
				<div className="lg:grid lg:grid-cols-2 lg:gap-12">
					{/* Left Content */}
					<div className="space-y-6">
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
							Predict the future on <span className="text-primary">Solana</span>
						</h1>

						<p className="text-lg text-gray-600 dark:text-gray-300">
							Trade on real-world events with ultra-low fees and instant
							settlement. Polysight brings decentralized prediction markets to
							everyone.
						</p>

						<div className="flex gap-4">
							<button
								onClick={() => router.push("/markets")}
								className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
								Start Trading
								<ArrowRight className="w-4 h-4" />
							</button>

							<button
								onClick={() => router.push("/create")}
								className="px-6 py-3 border rounded-lg hover:border-primary hover:text-primary transition-colors">
								Create Market
							</button>
						</div>
					</div>

					{/* Right Content */}
					<div className="mt-10 lg:mt-0 space-y-4">
						{features.map((feature, index) => (
							<div
								key={index}
								className="p-5 rounded-xl border hover:shadow-md transition-shadow">
								<div className="flex items-start gap-4">
									<div className={`p-3 rounded-lg ${feature.color}`}>
										{feature.icon}
									</div>
									<div>
										<h3 className="font-semibold text-lg">{feature.title}</h3>
										<p className="text-gray-600 dark:text-gray-300 mt-1">
											{feature.description}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
