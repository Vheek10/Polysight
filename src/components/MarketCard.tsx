/** @format */

// components/MarketCard.tsx
"use client";

import { Market } from "@/types/market";
import { formatDistanceToNow } from "date-fns";
import { TrendingUp, Clock, ChevronRight, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

interface MarketCardProps {
	market: Market;
	className?: string;
	style?: React.CSSProperties;
}

export default function MarketCard({
	market,
	className,
	style,
}: MarketCardProps) {
	const router = useRouter();
	const timeRemaining = formatDistanceToNow(market.endDate, {
		addSuffix: true,
	});

	const handleViewMarket = () => {
		router.push(`/market/${market.id}`);
	};

	return (
		<Card
			className={cn(
				"group cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-lg",
				className,
			)}
			style={style}
			onClick={handleViewMarket}>
			{/* Header */}
			<div className="mb-4 flex items-center justify-between">
				<span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
					{market.category}
				</span>
				<div className="flex items-center gap-1 text-sm text-muted-foreground">
					<Clock className="h-3 w-3" />
					{timeRemaining}
				</div>
			</div>

			{/* Question */}
			<h3 className="mb-3 line-clamp-2 text-lg font-semibold tracking-tight text-card-foreground group-hover:text-primary transition-colors">
				{market.question}
			</h3>
			<p className="mb-6 line-clamp-2 text-sm text-muted-foreground">
				{market.description}
			</p>

			{/* Outcomes */}
			<div className="mb-6 space-y-4">
				{market.outcomes.map((outcome) => (
					<div
						key={outcome.id}
						className="space-y-2">
						<div className="flex justify-between text-sm">
							<span className="font-medium text-card-foreground">
								{outcome.name}
							</span>
							<span className="font-bold text-card-foreground">
								{outcome.probability}%
							</span>
						</div>
						<div className="h-2 overflow-hidden rounded-full bg-muted">
							<div
								className={cn(
									"h-full rounded-full bg-gradient-to-r transition-all duration-500",
									outcome.color,
								)}
								style={{ width: `${outcome.probability}%` }}
							/>
						</div>
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>${outcome.currentPrice.toFixed(2)}</span>
							<span>${outcome.volume.toLocaleString()}</span>
						</div>
					</div>
				))}
			</div>

			{/* Stats */}
			<div className="flex items-center justify-between border-t pt-4">
				<div className="flex items-center gap-4 text-sm text-muted-foreground">
					<div className="flex items-center gap-1">
						<TrendingUp className="h-3 w-3" />
						<span className="font-medium">
							${market.volume.toLocaleString()}
						</span>
					</div>
					<div className="flex items-center gap-1">
						<Users className="h-3 w-3" />
						<span className="font-medium">{market.totalTrades}</span>
					</div>
				</div>
				<div className="flex items-center gap-1 text-primary transition-transform group-hover:translate-x-1">
					<span className="text-sm font-medium">Trade</span>
					<ChevronRight className="h-4 w-4" />
				</div>
			</div>
		</Card>
	);
}
