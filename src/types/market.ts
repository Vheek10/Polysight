/** @format */

// types/market.ts
export type MarketCategory =
	| "politics"
	| "sports"
	| "crypto"
	| "technology"
	| "finance"
	| "all";

export interface Market {
	id: string;
	question: string;
	description: string;
	category: MarketCategory;
	outcomes: Outcome[];
	volume: number;
	liquidity: number;
	endDate: Date;
	resolved: boolean;
	resolution?: string;
	creator: string;
	createdAt: Date;
	totalTrades: number;
}

export interface Outcome {
	id: string;
	name: string;
	probability: number;
	currentPrice: number;
	volume: number;
	color: string;
}

export interface Position {
	id: string;
	marketId: string;
	outcome: string;
	amount: number;
	averagePrice: number;
	potentialPayout: number;
	timestamp: Date;
}

export interface Trade {
	id: string;
	marketId: string;
	outcome: string;
	amount: number;
	price: number;
	side: "buy" | "sell";
	timestamp: Date;
	trader: string;
}
