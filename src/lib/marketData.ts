/** @format */

// lib/marketData.ts

export interface Market {
	id: string;
	title: string;
	category: string;
	volume: number;
	participants: number;
	yesPrice: number;
	noPrice: number;
	endDate: string;
	liquidity: number;
	tags: string[];
	change: string;
	source?: string;
	probability?: number;
	isResolved?: boolean;
	resolution?: "YES" | "NO" | "INVALID";
	createdAt: string;
}

// Categories for diverse markets
export const CATEGORIES = [
	"Politics",
	"Sports",
	"Crypto",
	"Tech",
	"Finance",
	"Entertainment",
	"Geopolitics",
	"Business",
	"Science",
	"Health",
	"Environment",
	"Space",
	"Gaming",
	"Elections",
	"World Events",
	"Culture",
	"Economics",
	"Legal",
	"Education",
	"Social",
] as const;

export type MarketCategory = (typeof CATEGORIES)[number];

// Mock data generator for 50+ diverse markets
export const generateMockMarkets = (count: number = 60): Market[] => {
	const markets: Market[] = [];
	const sources = [
		"Polymarket",
		"Manifold",
		"Kalshi",
		"PredictIt",
		"Zeitgeist",
	];

	const politicalTopics2025 = [
		"2025 US Presidential Election",
		"2025 UK General Election",
		"2025 Canadian Federal Election",
		"2025 French Legislative Election",
		"2025 German Federal Election",
		"2025 Australian Federal Election",
		"2025 Indian General Election",
		"2025 Brazilian Presidential Election",
		"2025 Mexican General Election",
		"2025 Japanese General Election",
	];

	const sportsEvents2025 = [
		"2025 Super Bowl Winner",
		"2025 NBA Finals Winner",
		"2025 World Series Winner",
		"2025 Stanley Cup Winner",
		"2025 UEFA Champions League Winner",
		"2025 FIFA Club World Cup",
		"2025 Cricket World Cup",
		"2025 Rugby World Cup",
		"2025 Tour de France Winner",
		"2025 Formula 1 Championship",
	];

	const cryptoPredictions2025 = [
		"Bitcoin Price Target",
		"Ethereum Price Target",
		"Solana Ecosystem Growth",
		"DeFi TVL Milestone",
		"NFT Market Recovery",
		"Web3 Adoption Rate",
		"Crypto Regulation Developments",
		"CBDC Implementation",
		"Layer 2 Scaling Solutions",
		"New Crypto Unicorns",
	];

	const techInnovations2025 = [
		"AGI Development Milestone",
		"Quantum Computing Breakthrough",
		"SpaceX Starship Success",
		"AI Regulation Framework",
		"VR/AR Adoption Rate",
		"Renewable Energy Tech",
		"Biotech Breakthroughs",
		"Autonomous Vehicles",
		"6G Network Deployment",
		"Metaverse Development",
	];

	const financeMarkets2025 = [
		"Federal Reserve Rates",
		"Stock Market Performance",
		"Global Recession Timing",
		"Inflation Control",
		"Housing Market Trends",
		"Commodity Prices",
		"Currency Exchange Rates",
		"Corporate Earnings",
		"IPO Performance",
		"Merger & Acquisition Activity",
	];

	const worldEvents2025 = [
		"Geopolitical Conflicts",
		"Climate Change Agreements",
		"Pandemic Preparedness",
		"Space Exploration Missions",
		"Global Trade Agreements",
		"Human Rights Developments",
		"Disaster Response Effectiveness",
		"Diplomatic Relations",
		"Terrorism Threat Levels",
		"Cyber Security Threats",
	];

	const allTopics = [
		...politicalTopics2025,
		...sportsEvents2025,
		...cryptoPredictions2025,
		...techInnovations2025,
		...financeMarkets2025,
		...worldEvents2025,
	];

	const getQuestionForTopic = (topic: string, category: string): string => {
		const questionTemplates = {
			Politics: `Will ${topic} result as predicted?`,
			Sports: `Will ${topic} achieve the expected outcome?`,
			Crypto: `Will ${topic} reach its projected target?`,
			Technology: `Will ${topic} meet its development timeline?`,
			Finance: `Will ${topic} follow the forecasted trend?`,
			Entertainment: `Will ${topic} achieve commercial success?`,
			Geopolitics: `Will ${topic} resolve peacefully?`,
			Business: `Will ${topic} meet business expectations?`,
			Science: `Will ${topic} achieve scientific breakthrough?`,
			Health: `Will ${topic} improve public health outcomes?`,
			Environment: `Will ${topic} positively impact climate change?`,
			Space: `Will ${topic} mission be successful?`,
			Gaming: `Will ${topic} game reach sales targets?`,
			Elections: `Will ${topic} candidate/party win?`,
			"World Events": `Will ${topic} occur as anticipated?`,
			Culture: `Will ${topic} influence cultural trends?`,
			Economics: `Will ${topic} economic indicator meet forecasts?`,
			Legal: `Will ${topic} legal case resolve as expected?`,
			Education: `Will ${topic} educational reform succeed?`,
			Social: `Will ${topic} social movement achieve goals?`,
		};

		return (
			questionTemplates[category as keyof typeof questionTemplates] ||
			`Will ${topic} happen?`
		);
	};

	const getTagsForCategory = (category: string): string[] => {
		const tagMap: Record<string, string[]> = {
			Politics: ["Breaking", "Government", "Policy"],
			Sports: ["Trending", "Championship", "Competition"],
			Crypto: ["Trending", "Digital Assets", "Blockchain"],
			Technology: ["New", "Innovation", "Future"],
			Finance: ["Markets", "Investing", "Economy"],
			Entertainment: ["Celebrity", "Media", "Showbiz"],
			Geopolitics: ["Breaking", "International", "Diplomacy"],
			Business: ["Corporate", "Industry", "Market"],
			Science: ["Research", "Discovery", "Academic"],
			Health: ["Medical", "Wellness", "Public"],
			Environment: ["Climate", "Sustainability", "Green"],
			Space: ["NASA", "Exploration", "Cosmos"],
			Gaming: ["Esports", "Console", "PC"],
			Elections: ["Voting", "Democracy", "Campaign"],
			"World Events": ["Global", "Breaking", "News"],
			Culture: ["Arts", "Society", "Trends"],
			Economics: ["Macro", "Data", "Analysis"],
			Legal: ["Court", "Justice", "Law"],
			Education: ["Schools", "Learning", "Academic"],
			Social: ["Community", "Activism", "Change"],
		};

		return tagMap[category] || [category];
	};

	for (let i = 1; i <= count; i++) {
		const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
		const topicIndex = Math.floor(Math.random() * allTopics.length);
		const topic = allTopics[topicIndex];
		const tags = getTagsForCategory(category);

		// Add special tags for some markets
		if (Math.random() > 0.7) tags.push("Trending");
		if (Math.random() > 0.8) tags.push("Breaking");
		if (Math.random() > 0.9) tags.push("New");

		const volume = Math.floor(Math.random() * 1000000) + 10000;
		const participants = Math.floor(Math.random() * 10000) + 100;
		const yesPrice = Math.random() * 0.4 + 0.3; // 30-70% range
		const noPrice = 1 - yesPrice;
		const change =
			Math.random() > 0.5
				? `+${(Math.random() * 15).toFixed(1)}%`
				: `-${(Math.random() * 10).toFixed(1)}%`;

		// Generate realistic end dates (within next 6 months to 2 years)
		const today = new Date();
		const daysToAdd = Math.floor(Math.random() * 730) + 30; // 30-760 days
		const endDate = new Date(today);
		endDate.setDate(today.getDate() + daysToAdd);

		markets.push({
			id: `market-${i}`,
			title: getQuestionForTopic(topic, category),
			category,
			volume,
			participants,
			yesPrice,
			noPrice,
			endDate: endDate.toISOString().split("T")[0],
			liquidity: Math.floor(volume * 0.8),
			tags: Array.from(new Set(tags)), // Remove duplicates
			change,
			source: sources[Math.floor(Math.random() * sources.length)],
			probability: yesPrice * 100,
			isResolved: false,
			createdAt: new Date(
				today.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000,
			).toISOString(), // Created within last 30 days
		});
	}

	return markets;
};

// Fetch markets with filtering options
export const fetchMarkets = async (options?: {
	category?: string;
	limit?: number;
	trending?: boolean;
	breaking?: boolean;
	new?: boolean;
}): Promise<Market[]> => {
	// Simulate API delay
	await new Promise((resolve) => setTimeout(resolve, 100));

	let markets = generateMockMarkets(60);

	// Apply filters
	if (options?.category && options.category !== "All Markets") {
		markets = markets.filter((market) => market.category === options.category);
	}

	if (options?.trending) {
		markets = markets.filter((market) => market.tags.includes("Trending"));
	}

	if (options?.breaking) {
		markets = markets.filter((market) => market.tags.includes("Breaking"));
	}

	if (options?.new) {
		markets = markets.filter((market) => market.tags.includes("New"));
	}

	// Apply limit
	if (options?.limit) {
		markets = markets.slice(0, options.limit);
	}

	return markets;
};

// Get market by ID
export const fetchMarketById = async (id: string): Promise<Market | null> => {
	const markets = generateMockMarkets(60);
	return markets.find((market) => market.id === id) || null;
};

// Get market statistics
export const getMarketStats = async () => {
	const markets = generateMockMarkets(60);

	const totalVolume = markets.reduce((sum, market) => sum + market.volume, 0);
	const totalParticipants = markets.reduce(
		(sum, market) => sum + market.participants,
		0,
	);
	const activeMarkets = markets.filter((m) => !m.isResolved).length;

	// Category distribution
	const categoryDistribution: Record<string, number> = {};
	markets.forEach((market) => {
		categoryDistribution[market.category] =
			(categoryDistribution[market.category] || 0) + 1;
	});

	return {
		totalVolume,
		totalParticipants,
		activeMarkets,
		categoryDistribution,
		totalMarkets: markets.length,
	};
};
