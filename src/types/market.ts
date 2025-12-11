/** @format */

// Unified categories
export const MARKET_CATEGORIES = [
	"politics",
	"sports",
	"crypto",
	"technology",
	"finance",
	"all",
] as const;

export type MarketCategory = (typeof MARKET_CATEGORIES)[number];

// ----------------------------------------------
// Base Interfaces
// ----------------------------------------------

export interface Outcome {
	id: string; // Unique ID
	name: string; // e.g. "YES", "NO", "Team A"
	probability: number; // 0 - 1 normalized probability
	currentPrice: number; // Market price
	volume: number; // Total traded volume
	color: string; // UI color
}

export interface Market {
	id: string; // Market ID
	question: string; // Primary question
	description: string; // Market description
	category: MarketCategory; // Unified categories
	outcomes: Outcome[]; // All outcomes
	volume: number; // Total traded volume
	liquidity: number; // LP or AMM liquidity
	endDate: string | Date; // ISO or Date object
	resolved: boolean; // True if finalized
	resolution?: string; // YES | NO | WINNER etc.
	creator: string; // Wallet address
	createdAt: string | Date; // Creation timestamp
	totalTrades: number; // Total number of trades
}

// ----------------------------------------------
// Portfolio / User Data
// ----------------------------------------------

export interface Position {
	id: string; // Position ID
	marketId: string; // Foreign key
	outcome: string; // Outcome ID
	amount: number; // Tokens bought
	averagePrice: number; // Weighted purchase price
	potentialPayout: number; // What user can win
	timestamp: string | Date; // When purchased
}

export interface Trade {
	id: string; // Trade ID
	marketId: string; // Associated market
	outcome: string; // Outcome ID
	amount: number; // Amount traded
	price: number; // Execution price
	side: "buy" | "sell"; // Trade direction
	timestamp: string | Date; // ISO or Date
	trader: string; // Wallet address
}
