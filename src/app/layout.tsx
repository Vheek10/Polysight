/** @format */

// lib/mockUsers.ts
// Temporary mock database for development
export const mockUsers = {
	users: [] as any[],

	createUser: (userData: any) => {
		const newUser = {
			id: Date.now().toString(),
			...userData,
			createdAt: new Date().toISOString(),
		};
		mockUsers.users.push(newUser);
		return newUser;
	},

	findUserByEmail: (email: string) => {
		return mockUsers.users.find((user) => user.email === email);
	},

	findUserByWallet: (walletAddress: string) => {
		return mockUsers.users.find((user) => user.walletAddress === walletAddress);
	},

	findUserByUsername: (username: string) => {
		return mockUsers.users.find((user) => user.username === username);
	},
};
