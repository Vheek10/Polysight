/** @format */

// lib/mockUsers.ts
// Simple mock database for development - NO PRISMA

interface MockUser {
	id: string;
	email?: string;
	name?: string;
	username?: string;
	walletAddress?: string;
	provider: string;
	createdAt: string;
}

export const mockUsers = {
	users: [] as MockUser[],

	createUser: (userData: Omit<MockUser, "id" | "createdAt">): MockUser => {
		const newUser: MockUser = {
			id: Date.now().toString(),
			...userData,
			createdAt: new Date().toISOString(),
		};
		mockUsers.users.push(newUser);
		return newUser;
	},

	findUserByEmail: (email: string): MockUser | undefined => {
		return mockUsers.users.find((user) => user.email === email);
	},

	findUserByWallet: (walletAddress: string): MockUser | undefined => {
		return mockUsers.users.find((user) => user.walletAddress === walletAddress);
	},

	findUserByUsername: (username: string): MockUser | undefined => {
		return mockUsers.users.find((user) => user.username === username);
	},
};
