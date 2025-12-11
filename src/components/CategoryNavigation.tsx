/** @format */

// components/CategoryNavigation.tsx
"use client";

interface CategoryNavigationProps {
	activeCategory: string;
	setActiveCategory: (category: string) => void;
}

// Navigation categories
const categories = [
	"All Markets",
	"Trending",
	"Breaking",
	"New",
	"Politics",
	"Sports",
	"Finance",
	"Crypto",
	"Geopolitics",
	"Earnings",
	"Tech",
	"Culture",
	"World",
	"Economy",
	"Elections",
	"Mentions",
	"More",
];

export default function CategoryNavigation({
	activeCategory,
	setActiveCategory,
}: CategoryNavigationProps) {
	return (
		<div className="sticky top-0 z-40 bg-background border-b border-border">
			<div className="max-w-7xl mx-auto px-4">
				<div className="py-3">
					{/* Categories */}
					<div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
						{categories.map((category) => (
							<button
								key={category}
								onClick={() => setActiveCategory(category)}
								className={`text-sm whitespace-nowrap transition-colors pb-2 border-b-2 ${
									activeCategory === category
										? "text-foreground border-primary"
										: "text-muted-foreground border-transparent hover:text-foreground"
								}`}>
								{category}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
