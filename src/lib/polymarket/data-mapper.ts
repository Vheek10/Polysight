/** @format */

// lib/polymarket/data-mapper.ts
import { BuilderMarket, BuilderTrade } from "./builder-api-client";
import { Market, Outcome, MarketCategory } from "@/types/market";

export class PolymarketDataMapper {
	// Static cache for price history to calculate 24h changes
	private static priceHistory = new Map<
		string,
		{ price: number; timestamp: number }[]
	>();
	private static priceChangeCache = new Map<string, number>();
	private static lastUpdateTime = 0;
	private static readonly MAX_HISTORY = 100;
	private static readonly PRICE_CHANGE_TTL = 5 * 60 * 1000; // 5 minutes

	static mapBuilderMarketToAppMarket(builderMarket: BuilderMarket): Market {
		// Calculate current prices from pool balances
		const prices = this.calculatePricesFromPool(builderMarket);

		// Calculate 24h price change for YES outcome (index 0 typically)
		const priceChange24h = this.calculatePriceChange(
			builderMarket.id,
			prices[0],
		);

		// Calculate 24h volume if available
		const volume24h =
			builderMarket.volume24h || this.estimate24hVolume(builderMarket.volume);

		// Create outcomes
		const outcomes: Outcome[] = builderMarket.outcomes.map(
			(outcomeName, index) => ({
				id: `${builderMarket.id}-outcome-${index}`,
				name: outcomeName,
				probability: prices[index] || 0.5,
				currentPrice: prices[index] || 0.5,
				volume: builderMarket.volume * (prices[index] || 0.5),
				color: this.getOutcomeColor(outcomeName),
				// Add price change for individual outcomes
				priceChange24h: index === 0 ? priceChange24h : -priceChange24h, // NO outcome typically moves opposite to YES
			}),
		);

		// Extract category
		const category = this.extractCategory(builderMarket);

		// Calculate market sentiment score
		const sentimentScore = this.calculateSentimentScore(builderMarket, prices);

		return {
			id: builderMarket.id,
			slug: builderMarket.slug || `market-${builderMarket.id}`,
			question: builderMarket.question,
			description: builderMarket.description || "",
			category: category as MarketCategory,
			outcomes,
			volume: builderMarket.volume,
			liquidity: builderMarket.liquidity,
			endDate: builderMarket.endTime,
			resolved: builderMarket.status === "resolved",
			creator: builderMarket.creator,
			createdAt: builderMarket.createdAt,
			totalTrades: Math.floor(builderMarket.volume / 10), // Estimate

			// New fields for enhanced display
			priceChange24h,
			volume24h,
			lastPriceUpdate: new Date().toISOString(),
			sentimentScore,

			tags: this.extractTags(builderMarket),
			externalData: {
				source: "polymarket-builder",
				originalId: builderMarket.id,
				conditionId: builderMarket.conditionId,
				marketMakerAddress: builderMarket.marketMakerAddress,
				status: builderMarket.status,
				poolBalances: builderMarket.poolBalances,
				creationFee: builderMarket.creatorFee,
			},
		};
	}

	static mapBuilderTradeToAppTrade(builderTrade: BuilderTrade) {
		return {
			id: builderTrade.id,
			marketId: builderTrade.marketId,
			outcome: builderTrade.outcome,
			price: builderTrade.price,
			amount: builderTrade.amount,
			side: builderTrade.takerSide,
			timestamp: builderTrade.timestamp,
			trader: builderTrade.taker,
			maker: builderTrade.maker,
			totalValue: builderTrade.price * builderTrade.amount,
		};
	}

	private static calculatePricesFromPool(market: BuilderMarket): number[] {
		// First try to use pool balances
		if (market.poolBalances && market.poolBalances.length > 0) {
			const total = market.poolBalances.reduce(
				(sum, balance) => sum + balance,
				0,
			);
			if (total > 0) {
				return market.poolBalances.map((balance) => {
					const price = balance / total;
					return Math.max(0.01, Math.min(0.99, price)); // Clamp between 0.01 and 0.99
				});
			}
		}

		// Fallback: Try to estimate from market volume or use equal distribution
		if (market.volume > 0) {
			// Simple heuristic: if market has volume, assume slight bias toward first outcome
			const basePrice = 0.5;
			const bias = Math.min(0.3, market.volume / 100000); // Up to 30% bias based on volume
			return market.outcomes.map((_, index) => {
				if (index === 0) return basePrice + bias;
				return (1 - (basePrice + bias)) / (market.outcomes.length - 1);
			});
		}

		// Last resort: equal distribution
		return new Array(market.outcomes.length).fill(1 / market.outcomes.length);
	}

	private static calculatePriceChange(
		marketId: string,
		currentPrice: number,
	): number {
		const now = Date.now();

		// Check cache first
		if (now - this.lastUpdateTime < this.PRICE_CHANGE_TTL) {
			const cached = this.priceChangeCache.get(marketId);
			if (cached !== undefined) return cached;
		}

		// Get or initialize price history
		let history = this.priceHistory.get(marketId) || [];

		if (history.length === 0) {
			// First time seeing this market
			history = [{ price: currentPrice, timestamp: now }];
			this.priceHistory.set(marketId, history);
			this.priceChangeCache.set(marketId, 0);
			return 0;
		}

		// Filter to keep only entries from last 24h
		const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;
		history = history.filter((entry) => entry.timestamp > twentyFourHoursAgo);

		if (history.length === 0) {
			// No history in last 24h
			this.priceChangeCache.set(marketId, 0);
			return 0;
		}

		// Find price 24h ago (or closest available)
		const oldestEntry = history.reduce((oldest, current) =>
			current.timestamp < oldest.timestamp ? current : oldest,
		);

		// Calculate percentage change
		const change =
			((currentPrice - oldestEntry.price) / oldestEntry.price) * 100;
		const roundedChange = parseFloat(change.toFixed(2));

		// Add current price to history
		history.push({ price: currentPrice, timestamp: now });

		// Trim history if too long
		if (history.length > this.MAX_HISTORY) {
			history = history.slice(-this.MAX_HISTORY);
		}

		// Update cache
		this.priceHistory.set(marketId, history);
		this.priceChangeCache.set(marketId, roundedChange);
		this.lastUpdateTime = now;

		return roundedChange;
	}

	private static estimate24hVolume(totalVolume: number): number {
		// Simple heuristic: assume 20% of total volume happened in last 24h
		// This is a rough estimate - in production you'd want actual 24h volume from API
		return totalVolume * 0.2;
	}

	private static calculateSentimentScore(
		market: BuilderMarket,
		prices: number[],
	): number {
		// Calculate a sentiment score from 0-100
		// Factors: price skew, volume, liquidity, time remaining

		let score = 50; // Neutral starting point

		// 1. Price skew factor (if YES is significantly > 0.5, bullish sentiment)
		if (prices.length > 0) {
			const yesPrice = prices[0];
			const priceSkew = (yesPrice - 0.5) * 2; // Convert to -1 to 1 scale
			score += priceSkew * 20; // Add up to ±20 points
		}

		// 2. Volume factor
		const volumeFactor = Math.min(1, market.volume / 1000000); // Scale by volume
		score += volumeFactor * 15;

		// 3. Liquidity factor
		const liquidityFactor = Math.min(1, market.liquidity / 500000); // Scale by liquidity
		score += liquidityFactor * 10;

		// 4. Time remaining factor (markets ending soon get more attention)
		const endTime = new Date(market.endTime).getTime();
		const now = Date.now();
		const daysLeft = Math.max(0, (endTime - now) / (1000 * 60 * 60 * 24));

		if (daysLeft < 7) {
			score += 10; // Boost for markets ending soon
		} else if (daysLeft > 30) {
			score -= 5; // Penalty for markets far in the future
		}

		// Clamp between 0 and 100
		return Math.max(0, Math.min(100, Math.round(score)));
	}

	private static extractCategory(market: BuilderMarket): string {
		// Priority 1: Use market.category if available
		if (market.category) {
			return (
				market.category.charAt(0).toUpperCase() +
				market.category.slice(1).toLowerCase()
			);
		}

		// Priority 2: Extract from resolution source
		if (market.resolutionSource) {
			const source = market.resolutionSource.toLowerCase();

			if (
				source.includes("election") ||
				source.includes("politics") ||
				source.includes("trump") ||
				source.includes("biden") ||
				source.includes("congress") ||
				source.includes("senate")
			)
				return "Politics";

			if (
				source.includes("sports") ||
				source.includes("game") ||
				source.includes("nba") ||
				source.includes("nfl") ||
				source.includes("mlb") ||
				source.includes("soccer")
			)
				return "Sports";

			if (
				source.includes("crypto") ||
				source.includes("bitcoin") ||
				source.includes("ethereum") ||
				source.includes("defi") ||
				source.includes("nft") ||
				source.includes("web3")
			)
				return "Crypto";

			if (
				source.includes("tech") ||
				source.includes("ai") ||
				source.includes("apple") ||
				source.includes("google") ||
				source.includes("microsoft") ||
				source.includes("meta")
			)
				return "Technology";

			if (
				source.includes("finance") ||
				source.includes("economy") ||
				source.includes("stock") ||
				source.includes("fed") ||
				source.includes("inflation") ||
				source.includes("interest")
			)
				return "Finance";

			if (
				source.includes("movie") ||
				source.includes("entertainment") ||
				source.includes("oscars") ||
				source.includes("music") ||
				source.includes("celebrity")
			)
				return "Entertainment";

			if (
				source.includes("weather") ||
				source.includes("climate") ||
				source.includes("environment") ||
				source.includes("energy")
			)
				return "Environment";

			if (
				source.includes("science") ||
				source.includes("space") ||
				source.includes("nasa") ||
				source.includes("health") ||
				source.includes("covid") ||
				source.includes("medicine")
			)
				return "Science";

			if (
				source.includes("world") ||
				source.includes("war") ||
				source.includes("ukraine") ||
				source.includes("china") ||
				source.includes("europe") ||
				source.includes("asia")
			)
				return "World Events";
		}

		// Priority 3: Try to guess from question
		const question = market.question.toLowerCase();

		const categoryKeywords = {
			Politics: [
				"trump",
				"biden",
				"election",
				"president",
				"senate",
				"congress",
				"vote",
				"democrat",
				"republican",
			],
			Sports: [
				"nba",
				"nfl",
				"mlb",
				"super bowl",
				"championship",
				"tournament",
				"player",
				"team",
				"win",
			],
			Crypto: [
				"bitcoin",
				"ethereum",
				"crypto",
				"btc",
				"eth",
				"solana",
				"defi",
				"nft",
				"blockchain",
			],
			Technology: [
				"ai",
				"artificial intelligence",
				"apple",
				"google",
				"meta",
				"microsoft",
				"tech",
				"software",
			],
			Finance: [
				"stock",
				"market",
				"economy",
				"fed",
				"inflation",
				"interest",
				"rate",
				"dollar",
				"bank",
			],
			Entertainment: [
				"oscar",
				"movie",
				"award",
				"celebrity",
				"music",
				"album",
				"tv",
				"show",
				"netflix",
			],
			Science: [
				"space",
				"nasa",
				"covid",
				"vaccine",
				"health",
				"medicine",
				"research",
				"study",
				"discovery",
			],
			"World Events": [
				"war",
				"ukraine",
				"russia",
				"china",
				"europe",
				"middle east",
				"conflict",
				"crisis",
			],
			Environment: [
				"climate",
				"weather",
				"temperature",
				"pollution",
				"energy",
				"carbon",
				"renewable",
			],
		};

		for (const [category, keywords] of Object.entries(categoryKeywords)) {
			if (keywords.some((keyword) => question.includes(keyword))) {
				return category;
			}
		}

		return "General";
	}

	private static extractTags(market: BuilderMarket): string[] {
		const tags = new Set<string>();

		// Add category
		const category = this.extractCategory(market);
		if (category !== "General") {
			tags.add(category);
		}

		// Add outcomes
		market.outcomes.forEach((outcome) => tags.add(outcome));

		// Add status
		tags.add(market.status);

		// Add time-based tags
		const endTime = new Date(market.endTime).getTime();
		const now = Date.now();
		const daysLeft = Math.max(0, (endTime - now) / (1000 * 60 * 60 * 24));

		if (daysLeft < 1) tags.add("Ending Today");
		else if (daysLeft < 3) tags.add("Ending Soon");
		else if (daysLeft < 7) tags.add("This Week");

		// Add volume/liquidity tags
		if (market.volume > 100000) tags.add("High Volume");
		if (market.liquidity > 50000) tags.add("High Liquidity");

		return Array.from(tags);
	}

	private static getOutcomeColor(outcomeName: string): string {
		const colors: Record<string, string> = {
			YES: "#10b981", // Green
			NO: "#ef4444", // Red
			TRUE: "#10b981",
			FALSE: "#ef4444",
			WIN: "#3b82f6", // Blue
			LOSE: "#ef4444",
			OVER: "#10b981",
			UNDER: "#ef4444",
			BIDEN: "#3b82f6", // Democratic blue
			TRUMP: "#ef4444", // Republican red
			DEMOCRAT: "#3b82f6",
			REPUBLICAN: "#ef4444",
			UP: "#10b981",
			DOWN: "#ef4444",
			HIGHER: "#10b981",
			LOWER: "#ef4444",
			MORE: "#10b981",
			LESS: "#ef4444",
			INCREASE: "#10b981",
			DECREASE: "#ef4444",
		};

		const upperName = outcomeName.toUpperCase();

		// Check for exact match
		if (colors[upperName]) return colors[upperName];

		// Check for partial matches
		if (
			upperName.includes("YES") ||
			upperName.includes("TRUE") ||
			upperName.includes("WIN")
		)
			return "#10b981";
		if (
			upperName.includes("NO") ||
			upperName.includes("FALSE") ||
			upperName.includes("LOSE")
		)
			return "#ef4444";

		// Default: use hash of string for consistent color
		let hash = 0;
		for (let i = 0; i < outcomeName.length; i++) {
			hash = outcomeName.charCodeAt(i) + ((hash << 5) - hash);
		}

		const hue = hash % 360;
		return `hsl(${hue}, 70%, 60%)`;
	}

	// Format for display
	static formatMarketForDisplay(market: Market) {
		const yesOutcome = market.outcomes.find((o) => o.name === "YES");
		const noOutcome = market.outcomes.find((o) => o.name === "NO");

		const yesPrice = yesOutcome?.currentPrice || 0.5;
		const noPrice = noOutcome?.currentPrice || 0.5;
		const yesPercentage = Math.round((yesOutcome?.probability || 0.5) * 100);
		const noPercentage = Math.round((noOutcome?.probability || 0.5) * 100);

		// Determine sentiment label
		let sentimentLabel = "Neutral";
		let sentimentColor = "text-gray-500";

		if (market.sentimentScore !== undefined) {
			if (market.sentimentScore >= 70) {
				sentimentLabel = "Bullish";
				sentimentColor = "text-green-600";
			} else if (market.sentimentScore >= 55) {
				sentimentLabel = "Slightly Bullish";
				sentimentColor = "text-green-500";
			} else if (market.sentimentScore <= 30) {
				sentimentLabel = "Bearish";
				sentimentColor = "text-red-600";
			} else if (market.sentimentScore <= 45) {
				sentimentLabel = "Slightly Bearish";
				sentimentColor = "text-red-500";
			}
		}

		return {
			...market,
			yesPrice,
			noPrice,
			yesPercentage,
			noPercentage,
			volumeFormatted: this.formatCurrency(market.volume),
			volume24hFormatted: market.volume24h
				? this.formatCurrency(market.volume24h)
				: "N/A",
			liquidityFormatted: this.formatCurrency(market.liquidity),
			daysLeft: this.calculateDaysLeft(market.endDate),
			isActive: !market.resolved,
			priceChangeFormatted:
				market.priceChange24h !== undefined
					? `${
							market.priceChange24h >= 0 ? "+" : ""
					  }${market.priceChange24h.toFixed(1)}%`
					: "N/A",
			sentimentLabel,
			sentimentColor,
			timeRemainingFormatted: this.formatTimeRemaining(market.endDate),
		};
	}

	private static formatCurrency(amount: number): string {
		if (amount === 0 || isNaN(amount)) return "$0";
		if (amount < 1) return `$${amount.toFixed(3)}`;
		if (amount < 1000) return `$${Math.round(amount)}`;
		if (amount < 1000000) return `$${(amount / 1000).toFixed(1)}K`;
		if (amount < 1000000000) return `$${(amount / 1000000).toFixed(1)}M`;
		return `$${(amount / 1000000000).toFixed(1)}B`;
	}

	private static calculateDaysLeft(endDate: string | Date): number {
		const end = new Date(endDate);
		const now = new Date();
		const diffTime = end.getTime() - now.getTime();
		return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
	}

	private static formatTimeRemaining(endDate: string | Date): string {
		const daysLeft = this.calculateDaysLeft(endDate);

		if (daysLeft === 0) {
			const end = new Date(endDate);
			const now = new Date();
			const diffHours = Math.max(
				0,
				Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60)),
			);

			if (diffHours === 0) {
				const diffMinutes = Math.max(
					0,
					Math.ceil((end.getTime() - now.getTime()) / (1000 * 60)),
				);
				return `${diffMinutes}m left`;
			}

			return `${diffHours}h left`;
		} else if (daysLeft === 1) {
			return "1 day left";
		} else if (daysLeft < 7) {
			return `${daysLeft} days left`;
		} else if (daysLeft < 30) {
			const weeks = Math.floor(daysLeft / 7);
			return `${weeks} week${weeks > 1 ? "s" : ""} left`;
		} else {
			const months = Math.floor(daysLeft / 30);
			return `${months} month${months > 1 ? "s" : ""} left`;
		}
	}

	// Utility methods for cache management
	static clearPriceHistory(): void {
		this.priceHistory.clear();
		this.priceChangeCache.clear();
		this.lastUpdateTime = 0;
	}

	static getPriceHistoryStats(): {
		totalMarketsTracked: number;
		avgHistoryLength: number;
	} {
		const marketIds = Array.from(this.priceHistory.keys());
		const totalHistoryLength = marketIds.reduce(
			(sum, marketId) => sum + (this.priceHistory.get(marketId)?.length || 0),
			0,
		);

		return {
			totalMarketsTracked: marketIds.length,
			avgHistoryLength:
				marketIds.length > 0 ? totalHistoryLength / marketIds.length : 0,
		};
	}
}
