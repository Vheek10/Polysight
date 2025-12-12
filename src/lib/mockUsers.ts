/** @format */

// lib/mockUsers.ts
export type MockUser = {
	id: string;
	email: string;
	name: string;
	username: string;
	image: string;
	emailVerified: string;
	provider: string;
	providerId: string;
	createdAt: string;
	updatedAt: string;
	profile: {
		balance: number;
		portfolioValue: number;
		watchlist: any[];
		transactions: any[];
	};
};

// In-memory storage for mock users
let mockUsers: MockUser[] = [
	// Add some initial mock users here if needed
];

export { mockUsers };

export function addMockUser(user: MockUser) {
	mockUsers.push(user);
	return user;
}

export function findUserByEmail(email: string) {
	return mockUsers.find((user) => user.email === email);
}
