/** @format */

// lib/marketData.ts
import { Market } from "@/types/market";
import crypto from "crypto";

export const CATEGORIES = [
	"All Markets",
	"Trending",
	"Breaking",
	"New",
	"Politics",
	"Sports",
	"Crypto",
	"Technology",
	"Finance",
	"Entertainment",
	"World Events",
	"Environment",
] as const;

// Builder API Configuration
const BUILDER_API_CONFIG = {
	baseUrl: "https://gamma-api.polymarket.com",
	apiKey: process.env.POLYMARKET_API_KEY || "",
	apiSecret: process.env.POLYMARKET_API_SECRET || "",
	passphrase: process.env.POLYMARKET_PASSPHRASE || "",
};

// Builder API Response Types
interface BuilderMarket {
	id: string;
	slug: string;
	question: string;
	description?: string;
	outcomes: BuilderOutcome[];
	category?: string;
	tags?: string[];
	volume24h?: number;
	volumeTotal?: number;
	liquidity?: number;
	createdTime: number;
	endTime?: number;
	isResolved: boolean;
	lastTradeTime?: number;
	resolution?: string;
	marketMaker: string;
}

interface BuilderOutcome {
	id: string;
	name: string;
	price: number;
	volume24h?: number;
	color?: string;
}

// Generate authentication headers for Builder API
function generateAuthHeaders(method: string, path: string, body: any = null) {
	const timestamp = Date.now().toString();
	const message =
		timestamp + method + path + (body ? JSON.stringify(body) : "");

	const signature = crypto
		.createHmac("sha256", BUILDER_API_CONFIG.apiSecret)
		.update(message)
		.digest("base64");

	return {
		"POLY-API-KEY": BUILDER_API_CONFIG.apiKey,
		"POLY-API-SIGNATURE": signature,
		"POLY-API-TIMESTAMP": timestamp,
		"POLY-API-PASSPHRASE": BUILDER_API_CONFIG.passphrase,
		"Content-Type": "application/json",
	};
}

// Check if API credentials are configured
function hasApiCredentials(): boolean {
	return !!(
		BUILDER_API_CONFIG.apiKey &&
		BUILDER_API_CONFIG.apiSecret &&
		BUILDER_API_CONFIG.passphrase
	);
}

export async function fetchMarkets(
	options: {
		trending?: boolean;
		breaking?: boolean;
		new?: boolean;
		category?: string;
		limit?: number;
		page?: number;
		sortBy?: "volume" | "liquidity" | "created" | "ending";
	} = {},
): Promise<Market[]> {
	// Check for API credentials first
	if (!hasApiCredentials()) {
		console.warn("Builder API credentials not configured. Using mock data.");
		return getMockMarkets(options);
	}

	try {
		const {
			trending,
			breaking,
			new: isNew,
			category,
			limit = 20,
			page = 1,
			sortBy = "volume",
		} = options;

		console.log("Fetching live markets from authenticated Builder API...");

		// Generate auth headers for the request
		const headers = generateAuthHeaders("GET", "/markets");

		// Fetch from Builder API with authentication
		const response = await fetch(
			`${BUILDER_API_CONFIG.baseUrl}/markets?limit=100`,
			{
				headers: headers as any,
			},
		);

		if (!response.ok) {
			console.error(
				`Builder API error: ${response.status} ${response.statusText}`,
			);
			throw new Error(`Builder API responded with status: ${response.status}`);
		}

		const builderMarkets: BuilderMarket[] = await response.json();

		console.log(`Found ${builderMarkets.length} raw markets from Builder API`);

		// Filter active markets
		let activeMarkets = builderMarkets.filter(
			(market) => !market.isResolved && market.resolution !== "CANCELED",
		);

		console.log(`${activeMarkets.length} active markets after filtering`);

		// Apply category filter
		if (category && category !== "All Markets") {
			const categoryLower = category.toLowerCase();
			activeMarkets = activeMarkets.filter(
				(market) =>
					market.category?.toLowerCase() === categoryLower ||
					market.tags?.some((tag) => tag.toLowerCase() === categoryLower) ||
					(market.category &&
						market.category.toLowerCase().includes(categoryLower)),
			);
			console.log(`${activeMarkets.length} markets after category filter`);
		}

		// Apply special filters
		if (trending) {
			// Sort by 24h volume for trending
			activeMarkets.sort((a, b) => (b.volume24h || 0) - (a.volume24h || 0));
		} else if (isNew) {
			// Sort by creation time for new markets
			activeMarkets.sort((a, b) => b.createdTime - a.createdTime);
		} else if (breaking) {
			// Filter for markets with recent high volume
			const oneHourAgo = Date.now() - 3600000;
			activeMarkets = activeMarkets.filter(
				(market) =>
					(market.volume24h || 0) > 50000 &&
					(market.lastTradeTime || market.createdTime * 1000) > oneHourAgo,
			);
			activeMarkets.sort((a, b) => (b.volume24h || 0) - (a.volume24h || 0));
		} else {
			// Apply default sorting
			switch (sortBy) {
				case "volume":
					activeMarkets.sort((a, b) => (b.volume24h || 0) - (a.volume24h || 0));
					break;
				case "liquidity":
					activeMarkets.sort((a, b) => (b.liquidity || 0) - (a.liquidity || 0));
					break;
				case "created":
					activeMarkets.sort((a, b) => b.createdTime - a.createdTime);
					break;
				case "ending":
					activeMarkets.sort(
						(a, b) => (a.endTime || Infinity) - (b.endTime || Infinity),
					);
					break;
			}
		}

		// Paginate and limit results
		const startIndex = (page - 1) * limit;
		activeMarkets = activeMarkets.slice(startIndex, startIndex + limit);

		// Map Builder API response to your Market type
		const markets: Market[] = activeMarkets.map((builderMarket) => {
			const yesOutcome = builderMarket.outcomes.find(
				(o) => o.name === "YES" || o.name === "Yes" || o.name === "yes",
			);
			const noOutcome = builderMarket.outcomes.find(
				(o) => o.name === "NO" || o.name === "No" || o.name === "no",
			);

			const yesPrice = yesOutcome?.price || 0.5;
			const noPrice = noOutcome?.price || 0.5;

			// Calculate actual probability from price
			const total = yesPrice + noPrice;
			const yesProbability = total > 0 ? yesPrice / total : 0.5;
			const noProbability = total > 0 ? noPrice / total : 0.5;

			// Mock price change for now (you'd need historical data)
			const priceChange24h = Math.random() * 10 - 5;

			return {
				id: builderMarket.id,
				slug: builderMarket.slug,
				question: builderMarket.question,
				description: builderMarket.description || "",
				category: builderMarket.category || "Uncategorized",
				outcomes: [
					{
						id: yesOutcome?.id || `${builderMarket.id}-yes`,
						name: "YES",
						probability: yesProbability,
						currentPrice: yesPrice,
						volume: yesOutcome?.volume24h || 0,
						color: "#10b981",
						priceChange24h: priceChange24h,
					},
					{
						id: noOutcome?.id || `${builderMarket.id}-no`,
						name: "NO",
						probability: noProbability,
						currentPrice: noPrice,
						volume: noOutcome?.volume24h || 0,
						color: "#ef4444",
						priceChange24h: -priceChange24h,
					},
				],
				volume: builderMarket.volumeTotal || 0,
				volume24h: builderMarket.volume24h || 0,
				liquidity: builderMarket.liquidity || 0,
				endDate: builderMarket.endTime
					? new Date(builderMarket.endTime * 1000).toISOString()
					: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
				resolved: builderMarket.isResolved,
				creator: builderMarket.marketMaker || "unknown",
				creatorVerified: false, // You might need to check this from API
				createdAt: new Date(builderMarket.createdTime * 1000).toISOString(),
				totalTrades: Math.floor((builderMarket.volumeTotal || 0) / 100), // Rough estimate
				priceChange24h: priceChange24h,
				trades24h: Math.floor((builderMarket.volume24h || 0) / 50), // Rough estimate
				lastPriceUpdate: new Date().toISOString(),
				sentimentScore: Math.floor(Math.random() * 100),
				tags: builderMarket.tags || [],
				externalData: {
					source: "builder-api",
					originalId: builderMarket.id,
					chainId: 137, // Polygon mainnet
					contractAddress: builderMarket.id, // This might be different
				},
			};
		});

		console.log(`Successfully mapped ${markets.length} markets`);
		return markets;
	} catch (error) {
		console.error("Error fetching live markets from Builder API:", error);

		// Fallback to mock data if API fails
		console.log("Falling back to mock data due to API error...");
		return getMockMarkets(options);
	}
}

// Function to fetch single market with authentication
export async function fetchMarketById(id: string): Promise<Market | null> {
	if (!hasApiCredentials()) {
		console.warn("API credentials not configured");
		return null;
	}

	try {
		const headers = generateAuthHeaders("GET", `/markets/${id}`);

		const response = await fetch(
			`${BUILDER_API_CONFIG.baseUrl}/markets/${id}`,
			{
				headers: headers as any,
			},
		);

		if (!response.ok) {
			console.error(`Failed to fetch market ${id}: ${response.status}`);
			return null;
		}

		const builderMarket: BuilderMarket = await response.json();

		// Map the response (similar to fetchMarkets mapping)
		const yesOutcome = builderMarket.outcomes.find(
			(o) => o.name === "YES" || o.name === "Yes" || o.name === "yes",
		);
		const noOutcome = builderMarket.outcomes.find(
			(o) => o.name === "NO" || o.name === "No" || o.name === "no",
		);

		const yesPrice = yesOutcome?.price || 0.5;
		const noPrice = noOutcome?.price || 0.5;

		const total = yesPrice + noPrice;
		const yesProbability = total > 0 ? yesPrice / total : 0.5;
		const noProbability = total > 0 ? noPrice / total : 0.5;

		return {
			id: builderMarket.id,
			slug: builderMarket.slug,
			question: builderMarket.question,
			description: builderMarket.description || "",
			category: builderMarket.category || "Uncategorized",
			outcomes: [
				{
					id: yesOutcome?.id || `${builderMarket.id}-yes`,
					name: "YES",
					probability: yesProbability,
					currentPrice: yesPrice,
					volume: yesOutcome?.volume24h || 0,
					color: "#10b981",
					priceChange24h: 0,
				},
				{
					id: noOutcome?.id || `${builderMarket.id}-no`,
					name: "NO",
					probability: noProbability,
					currentPrice: noPrice,
					volume: noOutcome?.volume24h || 0,
					color: "#ef4444",
					priceChange24h: 0,
				},
			],
			volume: builderMarket.volumeTotal || 0,
			volume24h: builderMarket.volume24h || 0,
			liquidity: builderMarket.liquidity || 0,
			endDate: builderMarket.endTime
				? new Date(builderMarket.endTime * 1000).toISOString()
				: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
			resolved: builderMarket.isResolved,
			creator: builderMarket.marketMaker || "unknown",
			creatorVerified: false,
			createdAt: new Date(builderMarket.createdTime * 1000).toISOString(),
			totalTrades: Math.floor((builderMarket.volumeTotal || 0) / 100),
			priceChange24h: 0,
			trades24h: Math.floor((builderMarket.volume24h || 0) / 50),
			lastPriceUpdate: new Date().toISOString(),
			sentimentScore: 50,
			tags: builderMarket.tags || [],
			externalData: {
				source: "builder-api",
				originalId: builderMarket.id,
				chainId: 137,
			},
		};
	} catch (error) {
		console.error(`Error fetching market ${id}:`, error);
		return null;
	}
}

// Real-time WebSocket connection with authentication
export function createMarketWebSocket(
	marketIds: string[],
	onUpdate: (data: any) => void,
) {
	if (!hasApiCredentials()) {
		console.warn("Cannot create WebSocket: API credentials not configured");
		return null;
	}

	try {
		const ws = new WebSocket("wss://gamma-api.polymarket.com/ws");

		ws.onopen = () => {
			// Authenticate first
			const authMsg = {
				type: "auth",
				apiKey: BUILDER_API_CONFIG.apiKey,
				apiSecret: BUILDER_API_CONFIG.apiSecret,
				passphrase: BUILDER_API_CONFIG.passphrase,
			};
			ws.send(JSON.stringify(authMsg));

			// Subscribe to markets after authentication
			setTimeout(() => {
				marketIds.forEach((marketId) => {
					ws.send(
						JSON.stringify({
							type: "subscribe",
							channel: "market",
							id: marketId,
						}),
					);
				});
			}, 1000);
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === "price_update" || data.type === "trade") {
				onUpdate(data);
			}
		};

		return ws;
	} catch (error) {
		console.error("Error creating WebSocket:", error);
		return null;
	}
}

// Mock data for fallback
function getMockMarkets(options: any): Market[] {
	console.log("Using mock markets for development");

	const mockMarkets: Market[] = [
		{
			id: "mock-1",
			slug: "bitcoin-100k-2024",
			question: "Will Bitcoin reach $100,000 before 2025?",
			description: "Predict if Bitcoin price will hit $100k USD",
			category: "Crypto",
			outcomes: [
				{
					id: "mock-1-yes",
					name: "YES",
					probability: 0.65,
					currentPrice: 0.65,
					volume: 1250000,
					color: "#10b981",
					priceChange24h: 2.5,
				},
				{
					id: "mock-1-no",
					name: "NO",
					probability: 0.35,
					currentPrice: 0.35,
					volume: 750000,
					color: "#ef4444",
					priceChange24h: -2.5,
				},
			],
			volume: 2000000,
			volume24h: 125000,
			liquidity: 500000,
			endDate: new Date("2024-12-31").toISOString(),
			resolved: false,
			creator: "crypto_builder",
			creatorVerified: true,
			createdAt: new Date("2024-01-01").toISOString(),
			totalTrades: 1250,
			priceChange24h: 2.5,
			trades24h: 45,
			lastPriceUpdate: new Date().toISOString(),
			sentimentScore: 72,
			tags: ["Bitcoin", "Crypto", "Price Prediction"],
			externalData: { source: "mock", originalId: "mock-1" },
		},
	];

	let filtered = mockMarkets;
	if (options.category && options.category !== "All Markets") {
		filtered = filtered.filter((m) => m.category === options.category);
	}
	if (options.limit) {
		filtered = filtered.slice(0, options.limit);
	}

	return filtered;
}
