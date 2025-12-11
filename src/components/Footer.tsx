/** @format */

// components/Footer.tsx
import { Github, Twitter, Globe } from "lucide-react";
import Link from "next/link";

export default function Footer() {
	return (
		<footer className="border-t bg-card">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center justify-between gap-6 md:flex-row">
					<div className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
							<Globe className="h-4 w-4 text-white" />
						</div>
						<span className="text-lg font-semibold text-card-foreground">
							Polysight
						</span>
					</div>

					<div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
						<Link
							href="/terms"
							className="hover:text-foreground transition-colors">
							Terms
						</Link>
						<Link
							href="/privacy"
							className="hover:text-foreground transition-colors">
							Privacy
						</Link>
						<Link
							href="/faq"
							className="hover:text-foreground transition-colors">
							FAQ
						</Link>
						<Link
							href="/docs"
							className="hover:text-foreground transition-colors">
							Documentation
						</Link>
						<Link
							href="/contact"
							className="hover:text-foreground transition-colors">
							Contact
						</Link>
					</div>

					<div className="flex items-center gap-4">
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-foreground transition-colors"
							aria-label="Twitter">
							<Twitter className="h-5 w-5" />
						</a>
						<a
							href="https://github.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-foreground transition-colors"
							aria-label="GitHub">
							<Github className="h-5 w-5" />
						</a>
					</div>
				</div>

				<div className="mt-6 border-t pt-6 text-center">
					<p className="text-sm text-muted-foreground">
						© {new Date().getFullYear()} Polysight. All rights reserved. Built
						on Solana.
					</p>
					<p className="mt-2 text-xs text-muted-foreground/70">
						Prediction markets involve risk. Past performance is not indicative
						of future results.
					</p>
				</div>
			</div>
		</footer>
	);
}
