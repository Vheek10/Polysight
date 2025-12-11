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

// Allowed categories (no "all")
type FormMarketCategory =
	| "politics"
	| "sports"
	| "crypto"
	| "technology"
	| "finance";

// Zod validation schema
const marketSchema = z.object({
	question: z.string().min(10, "Question must be at least 10 characters"),
	description: z.string().min(20, "Description must be at least 20 characters"),
	category: z.enum(["politics", "sports", "crypto", "technology", "finance"]),
	outcomes: z
		.array(z.string().min(1, "Outcome cannot be empty"))
		.min(2, "At least 2 outcomes required")
		.max(5, "Maximum 5 outcomes allowed"),
	endDate: z.string().min(1, "End date is required"),
	liquidity: z
		.number()
		.min(10, "Minimum liquidity is $10")
		.max(100000, "Maximum liquidity is $100,000"),
});

// Form Type
type MarketFormData = z.infer<typeof marketSchema>;

// Categories shown in UI
const categories: { value: FormMarketCategory; label: string }[] = [
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
		setValue,
		watch,
		formState: { errors },
	} = useForm<MarketFormData>({
		resolver: zodResolver(marketSchema),
		defaultValues: {
			category: "crypto",
			outcomes: ["", ""],
			liquidity: 100,
		},
	});

	// Add new outcome
	const addOutcome = () => {
		if (outcomes.length < 5) {
			const updated = [...outcomes, ""];
			setOutcomes(updated);
			setValue("outcomes", updated);
		}
	};

	// Remove existing outcome
	const removeOutcome = (index: number) => {
		if (outcomes.length > 2) {
			const updated = outcomes.filter((_, i) => i !== index);
			setOutcomes(updated);
			setValue("outcomes", updated);
		}
	};

	// Update a specific outcome
	const updateOutcome = (index: number, value: string) => {
		const updated = [...outcomes];
		updated[index] = value;
		setOutcomes(updated);
		setValue("outcomes", updated);
	};

	// Submit handler
	const onSubmit = async (data: MarketFormData) => {
		setIsSubmitting(true);
		try {
			console.log("Creating market:", data);
			await new Promise((r) => setTimeout(r, 2000));
			alert("Market created successfully!");
		} catch (error) {
			console.error(error);
		}
		setIsSubmitting(false);
	};

	return (
		<Card className="p-6 space-y-6 w-full">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-6">
				{/* Question */}
				<div className="space-y-2">
					<Label>Market Question</Label>
					<Input
						{...register("question")}
						placeholder="Who will win the 2025 Nigerian presidential election?"
					/>
					{errors.question && (
						<p className="text-red-500 text-sm">{errors.question.message}</p>
					)}
				</div>

				{/* Description */}
				<div className="space-y-2">
					<Label>Description</Label>
					<Textarea
						{...register("description")}
						placeholder="Provide context or background for this market..."
					/>
					{errors.description && (
						<p className="text-red-500 text-sm">{errors.description.message}</p>
					)}
				</div>

				{/* Category */}
				<div className="space-y-2">
					<Label>Category</Label>
					<div className="flex flex-wrap gap-3">
						{categories.map((category) => (
							<button
								key={category.value}
								type="button"
								onClick={() => setValue("category", category.value)}
								className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
									watch("category") === category.value
										? "bg-primary/10 border-primary text-primary"
										: "border-gray-400/30 hover:bg-gray-200/10"
								}`}>
								{category.label}
							</button>
						))}
					</div>
					{errors.category && (
						<p className="text-red-500 text-sm">{errors.category.message}</p>
					)}
				</div>

				{/* Outcomes */}
				<div className="space-y-3">
					<Label>Outcomes</Label>

					{outcomes.map((outcome, index) => (
						<div
							key={index}
							className="flex gap-3 items-center">
							<Input
								value={outcome}
								placeholder={`Outcome ${index + 1}`}
								onChange={(e) => updateOutcome(index, e.target.value)}
							/>
							{index > 1 && (
								<button
									type="button"
									onClick={() => removeOutcome(index)}
									className="text-red-500 hover:text-red-600">
									<Trash2 size={18} />
								</button>
							)}
						</div>
					))}

					{outcomes.length < 5 && (
						<Button
							type="button"
							onClick={addOutcome}
							className="flex items-center gap-2">
							<Plus size={16} /> Add Outcome
						</Button>
					)}

					{errors.outcomes && (
						<p className="text-red-500 text-sm">{errors.outcomes.message}</p>
					)}
				</div>

				{/* End Date */}
				<div className="space-y-2">
					<Label>End Date</Label>
					<Input
						type="datetime-local"
						{...register("endDate")}
					/>
					{errors.endDate && (
						<p className="text-red-500 text-sm">{errors.endDate.message}</p>
					)}
				</div>

				{/* Liquidity */}
				<div className="space-y-2">
					<Label>Initial Liquidity ($)</Label>
					<Input
						type="number"
						{...register("liquidity", { valueAsNumber: true })}
						placeholder="100"
					/>
					{errors.liquidity && (
						<p className="text-red-500 text-sm">{errors.liquidity.message}</p>
					)}
				</div>

				<Button
					type="submit"
					className="w-full"
					disabled={isSubmitting}>
					{isSubmitting ? "Creating..." : "Create Market"}
				</Button>
			</form>
		</Card>
	);
}
