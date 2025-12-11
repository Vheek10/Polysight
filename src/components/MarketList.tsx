/** @format */

// components/MarketList.tsx
"use client";

import { useState } from "react";
import MarketCard from "./MarketCard";
import { Market, MarketCategory } from "@/types/market";
import { Search, Filter, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";

const mockMarkets: Market[] = [
	{
		id: "1",
		question: "Will Bitcoin reach $100,000 by December 31, 2024?",
		description:
			"Based on closing price of BTC/USD on Coinbase at midnight UTC",
		category: "crypto",
		outcomes: [
			{
				id: "yes",
				name: "Yes",
				probability: 65,
				currentPrice: 0.65,
				volume: 125000,
				color: "from-blue-500 to-cyan-500",
			},
			{
				id: "no",
				name: "No",
				probability: 35,
				currentPrice: 0.35,
				volume: 75000,
				color: "from-gray-500 to-gray-600",
			},
		],
		volume: 200000,
		liquidity: 50000,
		endDate: new Date("2024-12-31"),
		resolved: false,
		creator: "solana...xyz789",
		createdAt: new Date("2024-01-15"),
		totalTrades: 1250,
	},
	{
		id: "2",
		question: "Which party will win the 2024 US Presidential election?",
		description: "Based on Electoral College results certified by Congress",
		category: "politics",
		outcomes: [
			{
				id: "dem",
				name: "Democratic",
				probability: 52,
				currentPrice: 0.52,
				volume: 300000,
				color: "from-blue-500 to-blue-600",
			},
			{
				id: "rep",
				name: "Republican",
				probability: 45,
				currentPrice: 0.45,
				volume: 250000,
				color: "from-red-500 to-red-600",
			},
			{
				id: "other",
				name: "Other",
				probability: 3,
				currentPrice: 0.03,
				volume: 15000,
				color: "from-gray-500 to-gray-600",
			},
		],
		volume: 565000,
		liquidity: 120000,
		endDate: new Date("2024-11-05"),
		resolved: false,
		creator: "solana...abc123",
		createdAt: new Date("2024-01-10"),
		totalTrades: 890,
	},
	{
		id: "3",
		question: "Will Apple release Vision Pro 2 in 2024?",
		description: "Official announcement before December 31, 2024",
		category: "technology",
		outcomes: [
			{
				id: "yes",
				name: "Yes",
				probability: 28,
				currentPrice: 0.28,
				volume: 85000,
				color: "from-gray-500 to-gray-600",
			},
			{
				id: "no",
				name: "No",
				probability: 72,
				currentPrice: 0.72,
				volume: 210000,
				color: "from-blue-500 to-cyan-500",
			},
		],
		volume: 295000,
		liquidity: 75000,
		endDate: new Date("2024-12-31"),
		resolved: false,
		creator: "solana...def456",
		createdAt: new Date("2024-01-20"),
		totalTrades: 540,
	},
];

const categories: MarketCategory[] = [
	"all",
	"crypto",
	"politics",
	"sports",
	"technology",
	"finance",
];

export default function MarketList() {
	const [selectedCategory, setSelectedCategory] =
		useState<MarketCategory>("all");
	const [searchQuery, setSearchQuery] = useState("");

	const filteredMarkets = mockMarkets.filter((market) => {
		const matchesCategory =
			selectedCategory === "all" || market.category === selectedCategory;
		const matchesSearch =
			market.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
			market.description.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	return (
		<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			{/* Header */}
			<div className="mb-8">
				<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-foreground">
							Prediction Markets
						</h1>
						<p className="mt-2 text-muted-foreground">
							Trade on the outcome of future events
						</p>
					</div>
					<div className="flex items-center gap-4">
						<div className="hidden sm:flex items-center gap-2 rounded-lg border bg-card px-4 py-2">
							<TrendingUp className="h-4 w-4 text-primary" />
							<span className="font-medium text-card-foreground">
								Live Markets: {mockMarkets.length}
							</span>
						</div>
					</div>
				</div>

				{/* Search and Filter */}
				<div className="mt-8 space-y-4">
					<div className="relative max-w-md">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="text"
							placeholder="Search markets..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>

					<div className="flex items-center gap-3">
						<Filter className="h-4 w-4 text-muted-foreground" />
						<Tabs
							value={selectedCategory}
							onValueChange={(value) =>
								setSelectedCategory(value as MarketCategory)
							}
							className="w-full">
							<TabsList className="flex w-full overflow-x-auto scrollbar-hide">
								{categories.map((category) => (
									<TabsTrigger
										key={category}
										value={category}
										className="capitalize">
										{category}
									</TabsTrigger>
								))}
							</TabsList>
						</Tabs>
					</div>
				</div>
			</div>

			{/* Market Grid */}
			{filteredMarkets.length > 0 ? (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{filteredMarkets.map((market, index) => (
						<MarketCard
							key={market.id}
							market={market}
							className="animate-fade-in"
							style={{ animationDelay: `${index * 100}ms` }}
						/>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center">
					<div className="rounded-full border bg-card p-4">
						<Search className="h-8 w-8 text-muted-foreground" />
					</div>
					<h3 className="mt-4 text-lg font-semibold text-card-foreground">
						No markets found
					</h3>
					<p className="mt-2 text-muted-foreground">
						Try adjusting your search or filter criteria
					</p>
				</div>
			)}
		</div>
	);
}
