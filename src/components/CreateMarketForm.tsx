/** @format */

// components/CreateMarketForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Calendar, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Card } from "@/components/ui/Card";

// Define the type locally to match your schema
type MarketCategory =
	| "politics"
	| "sports"
	| "crypto"
	| "technology"
	| "finance";

const marketSchema = z.object({
	question: z.string().min(10, "Question must be at least 10 characters"),
	description: z.string().min(20, "Description must be at least 20 characters"),
	category: z.enum(["politics", "sports", "crypto", "technology", "finance"]),
	outcomes: z
		.array(z.string())
		.min(2, "At least 2 outcomes required")
		.max(5, "Maximum 5 outcomes allowed"),
	endDate: z.string().min(1, "End date is required"),
	liquidity: z
		.number()
		.min(10, "Minimum liquidity is $10")
		.max(100000, "Maximum liquidity is $100,000"),
});

type MarketFormData = z.infer<typeof marketSchema>;

const categories: { value: MarketCategory; label: string }[] = [
	{ value: "politics", label: "Politics" },
	{ value: "sports", label: "Sports" },
	{ value: "crypto", label: "Crypto" },
	{ value: "technology", label: "Technology" },
	{ value: "finance", label: "Finance" },
];

export default function CreateMarketForm() {
	const [outcomes, setOutcomes] = useState(["", ""]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<MarketFormData>({
		resolver: zodResolver(marketSchema),
		defaultValues: {
			category: "crypto",
			outcomes: ["", ""],
			liquidity: 100,
		},
	});

	const addOutcome = () => {
		if (outcomes.length < 5) {
			const newOutcomes = [...outcomes, ""];
			setOutcomes(newOutcomes);
			setValue("outcomes", newOutcomes);
		}
	};

	const removeOutcome = (index: number) => {
		if (outcomes.length > 2) {
			const newOutcomes = outcomes.filter((_, i) => i !== index);
			setOutcomes(newOutcomes);
			setValue("outcomes", newOutcomes);
		}
	};

	const updateOutcome = (index: number, value: string) => {
		const newOutcomes = [...outcomes];
		newOutcomes[index] = value;
		setOutcomes(newOutcomes);
		setValue("outcomes", newOutcomes);
	};

	const onSubmit = async (data: MarketFormData) => {
		setIsSubmitting(true);
		try {
			console.log("Creating market:", data);
			await new Promise((resolve) => setTimeout(resolve, 2000));
			alert("Market created successfully!");
		} catch (error) {
			console.error("Error creating market:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
			<Card className="p-6">
				<div className="mb-8">
					<h2 className="text-2xl font-bold tracking-tight text-card-foreground">
						Create Prediction Market
					</h2>
					<p className="mt-2 text-muted-foreground">
						Set up a new market for traders to predict outcomes
					</p>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-6">
					{/* Question */}
					<div className="space-y-2">
						<Label htmlFor="question">Market Question</Label>
						<Textarea
							id="question"
							{...register("question")}
							placeholder="e.g., Will Bitcoin reach $100,000 by December 2024?"
							rows={2}
						/>
						{errors.question && (
							<p className="text-sm text-destructive">
								{errors.question.message}
							</p>
						)}
					</div>

					{/* Description */}
					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							{...register("description")}
							placeholder="Describe the market resolution criteria..."
							rows={3}
						/>
						{errors.description && (
							<p className="text-sm text-destructive">
								{errors.description.message}
							</p>
						)}
					</div>

					{/* Category */}
					<div className="space-y-2">
						<Label>Category</Label>
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
							{categories.map((category) => (
								<button
									key={category.value}
									type="button"
									onClick={() => setValue("category", category.value)}
									className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
										watch("category") === category.value
											? "border-primary bg-primary/10 text-primary"
											: "border-input bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground"
									}`}>
									{category.label}
								</button>
							))}
						</div>
					</div>

					{/* Outcomes */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<Label>Possible Outcomes</Label>
							<Button
								type="button"
								onClick={addOutcome}
								disabled={outcomes.length >= 5}
								variant="outline"
								size="sm"
								className="gap-1">
								<Plus className="h-3 w-3" />
								Add Outcome
							</Button>
						</div>
						<div className="space-y-3">
							{outcomes.map((outcome, index) => (
								<div
									key={index}
									className="flex items-center gap-3">
									<div className="flex-1">
										<Input
											type="text"
											value={outcome}
											onChange={(e) => updateOutcome(index, e.target.value)}
											placeholder={`Outcome ${index + 1}`}
										/>
									</div>
									{outcomes.length > 2 && (
										<Button
											type="button"
											onClick={() => removeOutcome(index)}
											variant="outline"
											size="icon"
											className="h-9 w-9">
											<Trash2 className="h-4 w-4" />
										</Button>
									)}
								</div>
							))}
						</div>
						{errors.outcomes && (
							<p className="text-sm text-destructive">
								{errors.outcomes.message}
							</p>
						)}
					</div>

					{/* End Date & Liquidity */}
					<div className="grid gap-6 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="endDate">Resolution Date</Label>
							<div className="relative">
								<Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="endDate"
									type="date"
									{...register("endDate")}
									className="pl-10"
									min={new Date().toISOString().split("T")[0]}
								/>
							</div>
							{errors.endDate && (
								<p className="text-sm text-destructive">
									{errors.endDate.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="liquidity">Initial Liquidity (USDC)</Label>
							<div className="relative">
								<DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="liquidity"
									type="number"
									{...register("liquidity", { valueAsNumber: true })}
									className="pl-10"
									step="10"
									min="10"
									max="100000"
								/>
							</div>
							{errors.liquidity && (
								<p className="text-sm text-destructive">
									{errors.liquidity.message}
								</p>
							)}
						</div>
					</div>

					{/* Submit */}
					<div className="pt-4">
						<Button
							type="submit"
							disabled={isSubmitting}
							className="w-full gap-2"
							size="lg">
							{isSubmitting ? (
								<>
									<Clock className="h-4 w-4 animate-spin" />
									Creating Market...
								</>
							) : (
								"Create Market"
							)}
						</Button>
						<p className="mt-3 text-center text-sm text-muted-foreground">
							Market creation fee: 0.5 SOL + transaction costs
						</p>
					</div>
				</form>
			</Card>
		</div>
	);
}
