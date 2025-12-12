/** @format */

// components/MarketCard.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Market } from "@/types/market";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";

interface MarketCardProps {
	market: Market;
}

interface ImageInfo {
	url: string;
	alt: string;
}

// Image cache to prevent duplicate requests
const imageCache = new Map<string, { image: ImageInfo; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Helper function to get a gradient color based on probability
const getProbabilityColor = (probability: number): string => {
	const hue = (probability / 100) * 120;
	return `hsl(${hue}, 70%, 50%)`;
};

// Generate a deterministic color based on category
const getCategoryColor = (category: string): string => {
	const colors = [
		"#3B82F6", // Blue
		"#10B981", // Emerald
		"#8B5CF6", // Purple
		"#EF4444", // Red
		"#F59E0B", // Amber
		"#EC4899", // Pink
		"#6366F1", // Indigo
		"#0EA5E9", // Sky
		"#14B8A6", // Teal
		"#22C55E", // Green
	];

	// Simple hash function for deterministic color
	let hash = 0;
	for (let i = 0; i < category.length; i++) {
		hash = category.charCodeAt(i) + ((hash << 5) - hash);
	}
	return colors[Math.abs(hash) % colors.length];
};

// Generate SVG placeholder with category initials
const generateSVGPlaceholder = (category: string = "Market"): string => {
	const initials = category
		.split(" ")
		.map((word) => word[0])
		.join("")
		.toUpperCase()
		.substring(0, 2);

	const color = getCategoryColor(category);

	return `data:image/svg+xml;base64,${btoa(`
		<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
			<rect width="80" height="80" rx="12" fill="${color}"/>
			<text x="40" y="48" font-family="Arial, sans-serif" font-size="28" font-weight="bold" 
				text-anchor="middle" fill="white" dominant-baseline="middle">${initials}</text>
		</svg>
	`)}`;
};

// Get cached image or placeholder
const getCachedImage = (market: Market): ImageInfo => {
	const cacheKey = market.id;
	const cached = imageCache.get(cacheKey);

	if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
		return cached.image;
	}

	// Return SVG placeholder immediately
	const svgUrl = generateSVGPlaceholder(market.category);
	return {
		url: svgUrl,
		alt: `${market.category} market placeholder`,
	};
};

// Set cached image
const setCachedImage = (marketId: string, image: ImageInfo) => {
	imageCache.set(marketId, { image, timestamp: Date.now() });
};

// Fetch small logo-like image with graceful degradation
const fetchMarketImage = async (market: Market): Promise<ImageInfo> => {
	const cacheKey = market.id;

	// Check cache first
	const cached = imageCache.get(cacheKey);
	if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
		return cached.image;
	}

	try {
		// Use Unsplash API if available
		const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

		if (!UNSPLASH_ACCESS_KEY) {
			throw new Error("No Unsplash API key");
		}

		// Create search query
		const yesOutcome = market.outcomes?.find((o) => o.name === "YES");
		const probability = (yesOutcome?.probability || 0.5) * 100;

		let predictionKeyword = "icon";
		if (probability > 70) predictionKeyword = "trophy winner";
		else if (probability > 60) predictionKeyword = "checkmark confirmed";
		else if (probability < 40) predictionKeyword = "question uncertain";
		else if (probability < 30) predictionKeyword = "x cancel";

		const searchQuery = `${
			market.category || "market"
		} ${predictionKeyword}`.toLowerCase();

		// Fetch with timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 2000);

		const response = await fetch(
			`https://api.unsplash.com/photos/random?query=${encodeURIComponent(
				searchQuery,
			)}&w=80&h=80&fit=crop&client_id=${UNSPLASH_ACCESS_KEY}`,
			{
				signal: controller.signal,
				cache: "force-cache",
			},
		);

		clearTimeout(timeoutId);

		if (!response.ok) {
			throw new Error(`Unsplash API error: ${response.status}`);
		}

		const data = await response.json();

		const imageInfo: ImageInfo = {
			url: data.urls.small || data.urls.thumb,
			alt: data.alt_description || `${market.category} market image`,
		};

		// Cache the successful fetch
		setCachedImage(cacheKey, imageInfo);
		return imageInfo;
	} catch (error) {
		// Fall back to DiceBear avatars (no API key required)
		try {
			// Recalculate probability here since it's out of scope in the catch block
			const yesOutcome = market.outcomes?.find((o) => o.name === "YES");
			const probability = (yesOutcome?.probability || 0.5) * 100;

			const seed = market.id || market.question;
			const style =
				probability > 60
					? "avataaars"
					: probability < 40
					? "bottts"
					: "personas";

			const imageInfo: ImageInfo = {
				url: `https://api.dicebear.com/7.x/${style}/png?seed=${seed}&size=80&backgroundColor=3b82f6`,
				alt: `${market.category} market avatar`,
			};

			setCachedImage(cacheKey, imageInfo);
			return imageInfo;
		} catch (fallbackError) {
			// Ultimate fallback to SVG
			const svgUrl = generateSVGPlaceholder(market.category);
			const imageInfo: ImageInfo = {
				url: svgUrl,
				alt: `${market.category} market placeholder`,
			};

			setCachedImage(cacheKey, imageInfo);
			return imageInfo;
		}
	}
};

// Preload images
const preloadImage = (url: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve();
		img.onerror = reject;
		img.src = url;
	});
};

export default function MarketCard({ market }: MarketCardProps) {
	const router = useRouter();
	const [selectedSide, setSelectedSide] = useState<"yes" | "no" | null>(null);
	const [amount, setAmount] = useState<string>("");
	const [isTradeMode, setIsTradeMode] = useState(false);
	const [imageInfo, setImageInfo] = useState<ImageInfo>(() =>
		getCachedImage(market),
	);
	const [imageLoading, setImageLoading] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);
	const abortControllerRef = useRef<AbortController | null>(null);

	// Get market outcomes
	const yesOutcome = market.outcomes?.find((o) => o.name === "YES");
	const noOutcome = market.outcomes?.find((o) => o.name === "NO");

	const yesPercentage = Math.round((yesOutcome?.probability || 0.5) * 100);
	const noPercentage = Math.round((noOutcome?.probability || 0.5) * 100);
	const priceChange = market.priceChange24h || 0;
	const isPositive = priceChange > 0;
	const changeValue = `${isPositive ? "+" : ""}${priceChange.toFixed(1)}%`;

	// Optimized image loading
	useEffect(() => {
		const loadImage = async () => {
			// Skip if already loaded or loading
			if (imageLoaded || imageLoading) return;

			// Get cached version first (instantly shows SVG)
			const cached = getCachedImage(market);
			setImageInfo(cached);

			// Check if we need to fetch a better image
			const isPlaceholderSVG = cached.url.startsWith("data:image/svg+xml");
			if (!isPlaceholderSVG) {
				setImageLoaded(true);
				return;
			}

			// Start loading better image
			setImageLoading(true);

			// Cancel any previous request
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			abortControllerRef.current = new AbortController();

			try {
				const newImage = await fetchMarketImage(market);

				// Only update if still mounted and not aborted
				if (!abortControllerRef.current?.signal.aborted) {
					setImageInfo(newImage);

					// Preload for smooth transition
					await preloadImage(newImage.url);
					setImageLoaded(true);
				}
			} catch (error) {
				if (error instanceof DOMException && error.name === "AbortError") {
					// Request was cancelled, ignore
					return;
				}
				// Keep the SVG placeholder on error
				console.debug("Image load failed, using placeholder:", error);
			} finally {
				setImageLoading(false);
			}
		};

		// Start loading with a small delay to prioritize UI
		const timer = setTimeout(loadImage, 100);

		return () => {
			clearTimeout(timer);
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, [market, imageLoaded, imageLoading]);

	if (!market) return null;

	const formatVolume = (volume: number): string => {
		if (!volume && volume !== 0) return "$0";
		if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`;
		if (volume >= 1000) return `$${(volume / 1000).toFixed(1)}K`;
		return `$${volume}`;
	};

	const handleYesClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setSelectedSide("yes");
		setIsTradeMode(true);
	};

	const handleNoClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setSelectedSide("no");
		setIsTradeMode(true);
	};

	const handleTradeSubmit = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!selectedSide || !amount || parseFloat(amount) <= 0) return;

		console.log(
			`Trade: ${selectedSide.toUpperCase()} $${amount} on ${market.id}`,
		);

		setIsTradeMode(false);
		setSelectedSide(null);
		setAmount("");

		router.push(`/market/${market.id}?side=${selectedSide}&amount=${amount}`);
	};

	const handleCancelTrade = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsTradeMode(false);
		setSelectedSide(null);
		setAmount("");
	};

	const handleCardClick = () => {
		if (!isTradeMode) {
			router.push(`/market/${market.slug || market.id}`);
		}
	};

	return (
		<div
			onClick={handleCardClick}
			className="cursor-pointer bg-card border border-border rounded-lg hover:bg-accent/30 transition-all duration-200 overflow-hidden">
			<div className="p-4">
				{/* Header with small image/logo and probability indicator */}
				<div className="flex items-start justify-between mb-3">
					{/* Left side: Small image/logo and category */}
					<div className="flex items-center gap-2">
						{/* Small logo/image container with smooth transitions */}
						<div className="relative">
							<div
								className={`relative w-10 h-10 rounded-lg overflow-hidden border border-border transition-all duration-300 ${
									imageLoading ? "opacity-50" : "opacity-100"
								}`}>
								{/* Main image with crossfade */}
								<img
									src={imageInfo.url}
									alt={imageInfo.alt}
									className={`w-full h-full object-cover transition-opacity duration-300 ${
										imageLoaded ? "opacity-100" : "opacity-0"
									}`}
									loading="lazy"
									onLoad={() => setImageLoaded(true)}
								/>

								{/* Loading spinner */}
								{imageLoading && (
									<div className="absolute inset-0 flex items-center justify-center bg-card/50">
										<Loader2 className="w-4 h-4 animate-spin text-primary" />
									</div>
								)}
							</div>

							{/* Small probability indicator overlay */}
							<div
								className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
									imageLoading ? "scale-90" : "scale-100"
								}`}
								style={{
									backgroundColor: getProbabilityColor(yesPercentage),
								}}>
								{yesPercentage}
							</div>
						</div>

						{/* Category and market info */}
						<div className="min-w-0">
							<span className="text-xs font-medium text-muted-foreground block truncate">
								{market.category || "Uncategorized"}
							</span>
							<span className="text-xs text-muted-foreground truncate">
								{market.source || "Market"}
							</span>
						</div>
					</div>

					{/* Right side: Price change indicator */}
					<div
						className={`flex items-center gap-1 text-xs font-medium transition-all duration-300 ${
							isPositive
								? "text-green-600 dark:text-green-400"
								: "text-red-600 dark:text-red-400"
						}`}>
						{isPositive ? (
							<TrendingUp className="h-3 w-3" />
						) : (
							<TrendingDown className="h-3 w-3" />
						)}
						{changeValue}
					</div>
				</div>

				{/* Question - Compact */}
				<h3 className="font-medium text-sm mb-3 line-clamp-2 text-card-foreground leading-tight transition-colors duration-200">
					{market.question}
				</h3>

				{/* Probability Bar - Compact */}
				<div className="mb-3">
					<div className="flex justify-between text-xs mb-1">
						<span className="text-green-600 dark:text-green-400 font-medium transition-colors duration-200">
							YES {yesPercentage}%
						</span>
						<span className="text-red-600 dark:text-red-400 font-medium transition-colors duration-200">
							NO {noPercentage}%
						</span>
					</div>
					<div className="h-1 bg-muted rounded-full overflow-hidden transition-all duration-500">
						<div
							className="h-full bg-green-500 transition-all duration-500 ease-out"
							style={{ width: `${yesPercentage}%` }}
						/>
					</div>
				</div>

				{/* Stats - Compact */}
				<div className="grid grid-cols-2 gap-3 text-xs mb-3">
					<div>
						<p className="text-muted-foreground transition-colors duration-200">
							Volume
						</p>
						<p className="font-medium text-card-foreground transition-colors duration-200">
							{formatVolume(market.volume24h || market.volume || 0)}
						</p>
					</div>
					<div>
						<p className="text-muted-foreground transition-colors duration-200">
							Liquidity
						</p>
						<p className="font-medium text-card-foreground transition-colors duration-200">
							{formatVolume(market.liquidity || 0)}
						</p>
					</div>
				</div>

				{/* Trade Mode */}
				{isTradeMode ? (
					<div
						className="space-y-2 animate-in fade-in duration-200"
						onClick={(e) => e.stopPropagation()}>
						<div
							className={`p-1.5 rounded text-center text-xs font-medium transition-all duration-200 ${
								selectedSide === "yes"
									? "bg-green-500/10 text-green-600 dark:text-green-400"
									: "bg-red-500/10 text-red-600 dark:text-red-400"
							}`}>
							Buy {selectedSide?.toUpperCase()}
						</div>

						<div className="relative">
							<input
								type="number"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								placeholder="Amount"
								className="w-full bg-background border border-input rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-200"
								min="0"
								step="0.01"
							/>
							<div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground transition-colors duration-200">
								USDC
							</div>
						</div>

						<div className="flex gap-1.5">
							<button
								onClick={handleCancelTrade}
								className="flex-1 py-1.5 text-xs font-medium rounded border border-input hover:bg-accent transition-all duration-200">
								Cancel
							</button>
							<button
								onClick={handleTradeSubmit}
								disabled={!amount || parseFloat(amount) <= 0}
								className={`flex-1 py-1.5 text-xs font-medium rounded transition-all duration-200 ${
									!amount || parseFloat(amount) <= 0
										? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
										: selectedSide === "yes"
										? "bg-green-500 hover:bg-green-600 text-white"
										: "bg-red-500 hover:bg-red-600 text-white"
								}`}>
								Buy
							</button>
						</div>
					</div>
				) : (
					/* Yes/No Buttons - Compact styling */
					<div className="flex gap-1.5">
						<button
							onClick={handleYesClick}
							className="flex-1 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-medium rounded transition-all duration-200 group">
							<div className="flex flex-col items-center">
								<span className="font-bold text-sm transition-transform duration-200 group-hover:scale-105">
									{yesPercentage}%
								</span>
								<span className="text-[10px] opacity-90 transition-opacity duration-200 group-hover:opacity-100">
									YES
								</span>
							</div>
						</button>
						<button
							onClick={handleNoClick}
							className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium rounded transition-all duration-200 group">
							<div className="flex flex-col items-center">
								<span className="font-bold text-sm transition-transform duration-200 group-hover:scale-105">
									{noPercentage}%
								</span>
								<span className="text-[10px] opacity-90 transition-opacity duration-200 group-hover:opacity-100">
									NO
								</span>
							</div>
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
