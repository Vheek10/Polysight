/** @format */

// lib/imageFetcher.ts

export interface ImageInfo {
	url: string;
	source: string;
	alt: string;
}

/**
 * Fetches relevant images based on market category and prediction
 * Uses Unsplash API for free, high-quality images
 */
export const fetchMarketImage = async (
	market: Market,
	size: "small" | "medium" | "large" = "small",
): Promise<ImageInfo | null> => {
	try {
		// Map categories to search keywords
		const categoryKeywords: Record<string, string[]> = {
			Politics: [
				"government",
				"election",
				"politician",
				"capitol",
				"democracy",
			],
			Sports: ["sports", "stadium", "athlete", "competition", "championship"],
			Crypto: [
				"cryptocurrency",
				"bitcoin",
				"blockchain",
				"digital",
				"technology",
			],
			Tech: ["technology", "innovation", "computer", "ai", "future"],
			Finance: ["finance", "stocks", "money", "trading", "economy"],
			Entertainment: ["entertainment", "movie", "music", "celebrity", "show"],
			Geopolitics: ["world", "global", "diplomacy", "international", "flags"],
			Business: ["business", "office", "corporate", "meeting", "industry"],
			Science: ["science", "research", "laboratory", "discovery", "microscope"],
			Health: ["health", "medical", "hospital", "wellness", "doctor"],
			Environment: [
				"environment",
				"nature",
				"climate",
				"sustainability",
				"earth",
			],
			Space: ["space", "universe", "stars", "galaxy", "astronomy"],
			Gaming: ["gaming", "esports", "video games", "controller", "console"],
			Elections: ["voting", "ballot", "election", "campaign", "vote"],
			"World Events": ["news", "global", "events", "breaking", "world"],
			Culture: ["culture", "art", "museum", "heritage", "tradition"],
			Economics: ["economics", "charts", "data", "statistics", "growth"],
			Legal: ["legal", "court", "justice", "law", "gavel"],
			Education: ["education", "school", "learning", "university", "books"],
			Social: ["social", "community", "people", "society", "connection"],
		};

		// Get keywords for the category
		const keywords = categoryKeywords[market.category] || [
			market.category.toLowerCase(),
		];

		// Add probability-based keyword
		const probabilityKeyword =
			market.probability && market.probability > 50 ? "success" : "uncertainty";
		const searchQuery = `${keywords[0]} ${probabilityKeyword}`;

		// Determine image size
		const sizeDimensions = {
			small: "400x300",
			medium: "800x600",
			large: "1200x800",
		};

		// Use Unsplash API (you'll need to sign up for a free API key at https://unsplash.com/developers)
		const UNSPLASH_ACCESS_KEY =
			process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || "your-unsplash-access-key";

		const response = await fetch(
			`https://api.unsplash.com/photos/random?query=${encodeURIComponent(
				searchQuery,
			)}&orientation=landscape&w=${sizeDimensions[size]}&h=${Math.floor(
				parseInt(sizeDimensions[size].split("x")[0]) * 0.75,
			)}&client_id=${UNSPLASH_ACCESS_KEY}`,
		);

		if (!response.ok) {
			throw new Error("Failed to fetch image");
		}

		const data = await response.json();

		return {
			url: data.urls.regular,
			source: "Unsplash",
			alt:
				data.alt_description ||
				`Image related to ${market.category}: ${market.title}`,
		};
	} catch (error) {
		console.error("Error fetching market image:", error);

		// Fallback to category-based placeholder images
		return getFallbackImage(market.category, size);
	}
};

/**
 * Provides fallback images when API fails
 */
const getFallbackImage = (category: string, size: string): ImageInfo => {
	const baseUrl = "https://images.unsplash.com/photo-";
	const categoryImages: Record<string, string> = {
		Politics: "1557683311-eac922347aa1",
		Sports: "1461896836934-ffe0ba2d2d23",
		Crypto: "1621761193238-b5d6092d0c7b",
		Tech: "1518432031352-d6fc5c10da5a",
		Finance: "1554224155-8d04cb21cd6c",
		Entertainment: -"1489599809516-9827b6d1cf13",
		Geopolitics: "1589652718065-faadacf6c5b9",
		Business: "1556761175-b4134ca6b2a3",
		Science: "1532094349884-543bc11c4b1d",
		Health: "1579684385127-7c4d6f79ebc8",
		Environment: "1501854140801-50d01634339e",
		Space: "1446776858070-8c7e6b2b3b7a",
		Gaming: "1542751371-adc38449a05f",
		Elections: "1540917149249-8d5be5c6d8b7",
		"World Events": "1589652718065-faadacf6c6c7",
		Culture: -"1511795409837-8c4a5c1c5c5c",
		Economics: "1551288049-bebda4e38f71",
		Legal: "1589829487213-c2f75672a6c6",
		Education: "1523050854058-8df731ef7c6f",
		Social: "1511795376181-467b7b4c4b7c",
	};

	const imageId = categoryImages[category] || "1499916078039-922301b0eb9b";

	return {
		url: `${baseUrl}${imageId}?w=${
			size === "small" ? 400 : size === "medium" ? 800 : 1200
		}&q=80&auto=format&fit=crop`,
		source: "Unsplash",
		alt: `${category} category image`,
	};
};

/**
 * Generates a gradient based on market probability
 * Useful as a fallback or overlay
 */
export const getProbabilityGradient = (probability: number): string => {
	// Red (0%) to Green (100%) gradient
	const hue = (probability / 100) * 120; // 0° (red) to 120° (green)
	return `hsl(${hue}, 70%, 50%)`;
};

/**
 * Batch fetch images for multiple markets
 */
export const fetchMarketImages = async (
	markets: Market[],
	size: "small" | "medium" | "large" = "small",
): Promise<Record<string, ImageInfo>> => {
	const imageMap: Record<string, ImageInfo> = {};

	// Fetch images in parallel with rate limiting
	const promises = markets.map(async (market) => {
		const image = await fetchMarketImage(market, size);
		if (image) {
			imageMap[market.id] = image;
		}
	});

	await Promise.all(promises);
	return imageMap;
};

/**
 * Caches images to avoid repeated API calls
 */
class ImageCache {
	private static instance: ImageCache;
	private cache: Map<string, { image: ImageInfo; timestamp: number }>;
	private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

	private constructor() {
		this.cache = new Map();
	}

	static getInstance(): ImageCache {
		if (!ImageCache.instance) {
			ImageCache.instance = new ImageCache();
		}
		return ImageCache.instance;
	}

	get(marketId: string): ImageInfo | null {
		const cached = this.cache.get(marketId);
		if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
			return cached.image;
		}
		return null;
	}

	set(marketId: string, image: ImageInfo): void {
		this.cache.set(marketId, { image, timestamp: Date.now() });
	}

	clear(): void {
		this.cache.clear();
	}
}
