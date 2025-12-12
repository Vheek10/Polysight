/** @format */

// components/SignUpModal.tsx
"use client";

import { X, Mail, Loader2, User, Lock, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
  onSignUp: () => void;
}

export default function SignUpModal({
  isOpen,
  onClose,
  onSwitchToSignIn,
  onSignUp,
}: SignUpModalProps) {
  const [view, setView] = useState<"welcome" | "wallet">("welcome");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  const { connected, publicKey, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setView("welcome");
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setEmailError(null);
      setPasswordError(null);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setTermsAccepted(false);
      setIsLoading(false);
      setIsConnectingWallet(false);
    }
  }, [isOpen]);

  // Handle wallet connection state changes
  useEffect(() => {
    setIsConnectingWallet(connecting);
    
    if (connected && publicKey && view === "wallet") {
      // Auto sign up when wallet connects in wallet view
      onSignUp();
      onClose();
    }
  }, [connected, publicKey, view, connecting, onSignUp, onClose]);

  if (!isOpen) return null;

  // Secure validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsLoading(false);
      onSignUp();
      onClose();
    } catch (error) {
      console.error("Google sign up error:", error);
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setPasswordError(null);

    // Validate terms acceptance
    if (!termsAccepted) {
      setEmailError("You must accept the Terms of Service and Privacy Policy");
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Validate username
    if (username.length < 3) {
      setEmailError("Username must be at least 3 characters");
      return;
    }

    // Validate username format (alphanumeric with underscores)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setEmailError("Username can only contain letters, numbers, and underscores");
      return;
    }

    // Validate password
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsLoading(false);
      onSignUp();
      onClose();
    } catch (error) {
      console.error("Email sign up error:", error);
      setIsLoading(false);
      setEmailError("Failed to create account. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleWalletSignUp = () => {
    if (connected && publicKey) {
      onSignUp();
      onClose();
    } else {
      // Show wallet modal if not connected
      setVisible(true);
    }
  };

  const truncateAddress = (address: string, length: number = 4) => {
    if (!address) return "";
    if (address.length <= length * 2 + 2) return address;
    return `${address.slice(0, length)}...${address.slice(-length)}`;
  };

  // Wallet logo with spinning animation component
  const WalletLogoWithSpinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
    const iconSize = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";
    const ringSize = size === "sm" ? "-inset-2" : size === "lg" ? "-inset-3" : "-inset-2";
    
    return (
      <div className="relative">
        {/* Spinning ring */}
        <div className={`absolute ${ringSize}`}>
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
        </div>
        
        {/* Wallet icon */}
        <Wallet className={`${iconSize} relative z-10`} />
      </div>
    );
  };

  const renderWalletConnectButton = () => {
    if (connected && publicKey) {
      return (
        <div className="space-y-3">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  Wallet Connected
                </p>
                <p className="text-xs text-green-700">
                  {truncateAddress(publicKey.toString())}
                </p>
              </div>
            </div>
            <button
              onClick={handleWalletSignUp}
              className="mt-3 w-full rounded-lg bg-green-600 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              Sign Up with Wallet
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={() => {
          setView("wallet");
          setVisible(true);
        }}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-transparent px-4 py-2.5 text-sm font-medium text-card-foreground transition-all hover:bg-accent hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label="Connect Solana wallet"
        disabled={isConnectingWallet}>
        {isConnectingWallet ? (
          <>
            <WalletLogoWithSpinner size="sm" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4" />
            Sign Up with Wallet
          </>
        )}
      </button>
    );
  };

  const renderWalletConnectingAnimation = () => {
    return (
      <div className="relative">
        {/* Background container with subtle pulse */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 animate-pulse" />

        {/* Main container */}
        <div className="relative rounded-xl border border-primary/20 bg-card/50 p-6 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Wallet icon with multiple animations */}
            <div className="relative">
              {/* Outer ring - spinning */}
              <div className="absolute -inset-3 rounded-full">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
              </div>

              {/* Middle ring - pulsing */}
              <div className="absolute -inset-2 rounded-full bg-primary/10 animate-ping" />

              {/* Wallet icon */}
              <div className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>

            {/* Text content */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-card-foreground">
                Awaiting Wallet Connection
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Please confirm the connection in your wallet
              </p>
            </div>

            {/* Loading indicators */}
            <div className="flex items-center gap-1">
              <div
                className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>

        {/* Cancel button */}
        <button
          onClick={() => {
            if (disconnect) {
              disconnect();
            }
            setView("welcome");
          }}
          className="mt-4 w-full rounded-lg border border-input bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Cancel wallet connection">
          Cancel
        </button>
      </div>
    );
  };

  const renderWalletConnectView = () => {
    if (isConnectingWallet) {
      return renderWalletConnectingAnimation();
    }

    return (
      <>
        <button
          onClick={() => setVisible(true)}
          disabled={isConnectingWallet}
          className="group relative flex w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-primary via-primary/90 to-primary/80 px-4 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Connect Solana wallet">
          {isConnectingWallet ? (
            <>
              <WalletLogoWithSpinner size="md" />
              Awaiting Connection...
            </>
          ) : (
            <>
              <Wallet className="h-5 w-5" />
              Connect Solana Wallet
            </>
          )}
        </button>

        {/* Help Text */}
        <div className="rounded-lg bg-accent/30 p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="font-medium text-card-foreground">
              Need a wallet?
            </strong>{" "}
            Download{" "}
            <a
              href="https://phantom.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded">
              Phantom
            </a>{" "}
            or{" "}
            <a
              href="https://solflare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded">
              Solflare
            </a>{" "}
            to get started with Solana.
          </p>
        </div>

        {/* Already have wallet connected? */}
        {connected && publicKey && (
          <div className="space-y-3">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Wallet Connected
                  </p>
                  <p className="text-xs text-green-700">
                    {truncateAddress(publicKey.toString(), 8)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleWalletSignUp}
                className="mt-3 w-full rounded-lg bg-green-600 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                Sign Up with Wallet
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-modal-title">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            "relative w-full max-w-md transform overflow-hidden rounded-xl border bg-card shadow-2xl transition-all duration-300",
            "animate-scale-in",
          )}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-accent/50 text-muted-foreground transition-all hover:bg-accent hover:text-foreground hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Close sign up modal">
            <X className="h-4 w-4" />
          </button>

          {/* Modal Content */}
          <div className="p-6 sm:p-8">
            {/* Welcome View */}
            {view === "welcome" && (
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                  <h1
                    id="signup-modal-title"
                    className="text-2xl font-bold tracking-tight text-card-foreground">
                    Join Polysight
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Create an account to start trading on Solana prediction
                    markets
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  {/* Google Button */}
                  <button
                    onClick={handleGoogleSignUp}
                    disabled={isLoading}
                    className="group relative flex w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-white to-white/90 px-4 py-3 text-sm font-medium text-gray-900 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    aria-label="Sign up with Google">
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          aria-hidden="true">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        <span>Sign up with Google</span>
                      </>
                    )}
                  </button>

                  {/* OR Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-card px-2 text-muted-foreground">
                        OR
                      </span>
                    </div>
                  </div>

                  {/* Email Sign Up Form */}
                  <form
                    onSubmit={handleEmailSignUp}
                    className="space-y-4">
                    {/* Email Field */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError(null);
                          }}
                          placeholder="Email address"
                          className="w-full rounded-lg border border-input bg-transparent py-3 pl-10 pr-4 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                          required
                          aria-label="Email address"
                          aria-invalid={emailError ? "true" : "false"}
                          aria-describedby={
                            emailError ? "email-error" : undefined
                          }
                          disabled={isLoading}
                        />
                      </div>
                      {emailError && (
                        <p
                          id="email-error"
                          className="text-xs text-destructive"
                          role="alert">
                          {emailError}
                        </p>
                      )}
                    </div>

                    {/* Username Field */}
                    <div className="space-y-2">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value);
                            setEmailError(null);
                          }}
                          placeholder="Username (3-20 characters)"
                          className="w-full rounded-lg border border-input bg-transparent py-3 pl-10 pr-4 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                          required
                          minLength={3}
                          maxLength={20}
                          pattern="[a-zA-Z0-9_]+"
                          title="Letters, numbers, and underscores only"
                          aria-label="Username"
                          disabled={isLoading}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Letters, numbers, and underscores only
                      </p>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError(null);
                          }}
                          placeholder="Password (min 8 characters)"
                          className="w-full rounded-lg border border-input bg-transparent py-3 pl-10 pr-10 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                          required
                          minLength={8}
                          aria-label="Password"
                          aria-invalid={passwordError ? "true" : "false"}
                          aria-describedby={
                            passwordError ? "password-error" : undefined
                          }
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }>
                          {showPassword ? (
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      {passwordError && (
                        <p
                          id="password-error"
                          className="text-xs text-destructive"
                          role="alert">
                          {passwordError}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Must contain uppercase, lowercase, number, and special character
                      </p>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPasswordError(null);
                          }}
                          placeholder="Confirm password"
                          className="w-full rounded-lg border border-input bg-transparent py-3 pl-10 pr-10 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                          required
                          aria-label="Confirm password"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }>
                          {showConfirmPassword ? (
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Terms Agreement */}
                    <label className="flex items-start gap-3 text-xs">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-input text-primary focus:ring-primary/50"
                        required
                        aria-label="Agree to terms and privacy policy"
                      />
                      <span className="text-muted-foreground">
                        I agree to the{" "}
                        <a
                          href="/terms"
                          className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy"
                          className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded">
                          Privacy Policy
                        </a>
                      </span>
                    </label>

                    {/* Create Account Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-lg bg-gradient-to-r from-primary via-primary/90 to-primary/80 py-3 text-sm font-medium text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      aria-label="Create account">
                      {isLoading ? (
                        <>
                          <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </form>

                  {/* OR Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-card px-2 text-muted-foreground">
                        OR
                      </span>
                    </div>
                  </div>

                  {/* Connect Wallet Button */}
                  {renderWalletConnectButton()}
                </div>

                {/* Switch to Sign In */}
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    onClick={onSwitchToSignIn}
                    className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded">
                    Sign in
                  </button>
                </p>
              </div>
            )}

            {/* Wallet Connect View */}
            {view === "wallet" && (
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                  <button
                    onClick={() => {
                      setView("welcome");
                      if (isConnectingWallet && disconnect) {
                        disconnect();
                      }
                    }}
                    className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                    aria-label="Back to sign up options"
                    disabled={isConnectingWallet && !disconnect}>
                    ← Back {isConnectingWallet ? "(Cancel)" : ""}
                  </button>
                  <h2 className="text-2xl font-bold tracking-tight text-card-foreground">
                    Sign Up with Solana Wallet
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Connect your Solana wallet to create an account
                  </p>
                </div>

                {/* Wallet Options */}
                <div className="space-y-3">{renderWalletConnectView()}</div>

                {/* Switch to other methods */}
                {!isConnectingWallet && (
                  <p className="text-center text-sm text-muted-foreground">
                    Prefer email or Google sign up?{" "}
                    <button
                      onClick={() => setView("welcome")}
                      className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded">
                      Back to all options
                    </button>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}