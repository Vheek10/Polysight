/** @format */

// components/CategoryNavigation.tsx
"use client";

import { CATEGORIES } from "@/lib/marketData";

interface CategoryNavigationProps {
	activeCategory: string;
	setActiveCategory: (category: string) => void;
}

// Navigation categories including special filters
const navigationCategories = [
	"All Markets",
	"Trending",
	"Breaking",
	"New",
	...CATEGORIES,
	"More",
];

export default function CategoryNavigation({
	activeCategory,
	setActiveCategory,
}: CategoryNavigationProps) {
	return (
		<div className="sticky top-0 z-40 bg-background">
			<div className="max-w-7xl mx-auto px-4">
				<div className="py-3">
					{/* Categories */}
					<div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
						{navigationCategories.map((category) => (
							<button
								key={category}
								onClick={() => setActiveCategory(category)}
								className={`text-sm whitespace-nowrap transition-colors pb-2 border-b-2 ${
									activeCategory === category
										? "text-foreground border-current"
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
