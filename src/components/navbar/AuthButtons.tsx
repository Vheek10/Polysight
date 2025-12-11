/** @format */

interface AuthButtonsProps {
	onLogin: () => void;
	onSignUp: () => void;
	isSignedIn: boolean;
}

export function AuthButtons({
	onLogin,
	onSignUp,
	isSignedIn,
}: AuthButtonsProps) {
	if (isSignedIn) return null;

	return (
		<div className="hidden sm:flex items-center gap-4">
			<button
				onClick={onLogin}
				className="rounded-lg bg-transparent px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-300 hover:bg-accent/50 hover:shadow-md cursor-pointer border border-input/30 hover:border-primary/30">
				Login
			</button>
			<button
				onClick={onSignUp}
				className="rounded-lg bg-gradient-to-r from-primary via-primary/90 to-primary/80 px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:from-primary hover:to-primary/90 hover:shadow-xl hover:shadow-primary/40 hover:translate-y-[-2px] cursor-pointer">
				Sign Up
			</button>
		</div>
	);
}
