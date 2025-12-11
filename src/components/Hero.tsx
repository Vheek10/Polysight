/** @format */

// components/Hero.tsx
"use client";

import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function Hero() {
	const router = useRouter();

	return (
		<div className="relative overflow-hidden">
			<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
				<div className="lg:grid lg:grid-cols-2 lg:gap-12">
					<div className="lg:pr-8">
						<div className="animate-fade-in">
							<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
								Predict the future on{" "}
								<span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
									Solana
								</span>
							</h1>
							<p className="mt-6 text-lg text-muted-foreground">
								Trade on real-world events with lightning-fast transactions.
								Polysight brings decentralized prediction markets to everyone.
							</p>

							<div className="mt-8 flex flex-col gap-4 sm:flex-row">
								<Button
									onClick={() => router.push("/markets")}
									size="lg"
									className="gap-2">
									Start Trading
									<ArrowRight className="h-4 w-4" />
								</Button>
								<Button
									onClick={() => router.push("/create")}
									variant="outline"
									size="lg">
									Create Market
								</Button>
							</div>
						</div>
					</div>

					<div className="mt-12 lg:mt-0">
						<div className="space-y-4">
							<div className="animate-slide-up rounded-xl border bg-card p-6 shadow-sm delay-100">
								<div className="flex items-center gap-4">
									<div className="rounded-lg bg-primary/10 p-3">
										<TrendingUp className="h-6 w-6 text-primary" />
									</div>
									<div>
										<h3 className="font-semibold text-card-foreground">
											Active Markets
										</h3>
										<p className="text-sm text-muted-foreground">
											Trade on politics, sports, crypto & more
										</p>
									</div>
								</div>
							</div>

							<div className="animate-slide-up rounded-xl border bg-card p-6 shadow-sm delay-200">
								<div className="flex items-center gap-4">
									<div className="rounded-lg bg-green-500/10 p-3">
										<Zap className="h-6 w-6 text-green-500" />
									</div>
									<div>
										<h3 className="font-semibold text-card-foreground">
											Fast Execution
										</h3>
										<p className="text-sm text-muted-foreground">
											Instant trades with Solana speed
										</p>
									</div>
								</div>
							</div>

							<div className="animate-slide-up rounded-xl border bg-card p-6 shadow-sm delay-300">
								<div className="flex items-center gap-4">
									<div className="rounded-lg bg-blue-500/10 p-3">
										<Shield className="h-6 w-6 text-blue-500" />
									</div>
									<div>
										<h3 className="font-semibold text-card-foreground">
											Secure Trading
										</h3>
										<p className="text-sm text-muted-foreground">
											Fully decentralized and transparent
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
