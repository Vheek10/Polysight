// lib/polymarket/builder-api-client.ts
import CryptoJS from 'crypto-js';

export interface BuilderMarket {
  id: string;
  conditionId: string;
  slug: string;
  question: string;
  description: string;
  outcomes: string[];
  endTime: string;
  resolutionSource: string;
  creator: string;
  creatorFee: number;
  liquidity: number;
  volume: number;
  status: 'pending' | 'active' | 'resolved' | 'canceled';
  createdAt: string;
  updatedAt: string;
  marketMakerAddress?: string;
  collateralToken?: string;
  poolBalances?: number[];
  currentPrices?: number[];
  volume24h?: number;
}

export interface BuilderTrade {
  id: string;
  marketId: string;
  outcome: string;
  price: number;
  amount: number;
  takerSide: 'buy' | 'sell';
  timestamp: string;
  taker: string;
  maker: string;
}

export interface BuilderOrder {
  id: string;
  marketId: string;
  outcome: string;
  side: 'buy' | 'sell';
  price: number;
  amount: number;
  filledAmount: number;
  status: 'open' | 'filled' | 'cancelled';
  createdAt: string;
}

export interface BuilderAccount {
  walletAddress: string;
  email: string;
  totalMarketsCreated: number;
  totalVolume: number;
  totalFeesEarned: number;
  accountStatus: string;
}

class PolymarketBuilderAPIClient {
  private baseUrl: string;
  private apiKey: string;
  private apiSecret: string;
  private passphrase: string;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheTTL: number;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_POLYMARKET_BUILDER_API_URL || 
                  'https://api.polymarket.com/v1';
    this.apiKey = process.env.POLYMARKET_BUILDER_API_KEY || '';
    this.apiSecret = process.env.POLYMARKET_BUILDER_API_SECRET || '';
    this.passphrase = process.env.POLYMARKET_BUILDER_API_PASSPHRASE || '';
    this.cache = new Map();
    this.cacheTTL = 30000; // 30 seconds

    if (!this.apiKey || !this.apiSecret || !this.passphrase) {
      console.warn('Polymarket Builder API credentials missing. Some features disabled.');
    }
  }

  private generateSignature(
    timestamp: string,
    method: string,
    requestPath: string,
    body: string = ''
  ): string {
    const prehash = timestamp + method.toUpperCase() + requestPath + body;
    const hmac = CryptoJS.HmacSHA256(prehash, this.apiSecret);
    return hmac.toString(CryptoJS.enc.Base64);
  }

  private getHeaders(
    method: string,
    endpoint: string,
    body: string = '',
    requiresAuth: boolean = true
  ): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Polysight/1.0 (Solana Devnet)',
    };

    if (requiresAuth && this.apiKey && this.apiSecret && this.passphrase) {
      const timestamp = Date.now().toString();
      const signature = this.generateSignature(timestamp, method, endpoint, body);
      
      headers['POLY-ACCESS-KEY'] = this.apiKey;
      headers['POLY-ACCESS-SIGN'] = signature;
      headers['POLY-ACCESS-TIMESTAMP'] = timestamp;
      headers['POLY-ACCESS-PASSPHRASE'] = this.passphrase;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth: boolean = true,
    useCache: boolean = true
  ): Promise<T> {
    const cacheKey = `${endpoint}:${JSON.stringify(options.body || {})}`;
    
    if (useCache) {
      const cached = this.getCache(cacheKey);
      if (cached) return cached;
    }

    const url = `${this.baseUrl}${endpoint}`;
    const method = options.method || 'GET';
    const body = options.body ? options.body.toString() : '';

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(method, endpoint, body, requiresAuth),
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        console.error('Builder API Error:', {
          status: response.status,
          endpoint,
          error: errorData,
        });
        
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (useCache) {
        this.setCache(cacheKey, data);
      }
      
      return data;
    } catch (error) {
      console.error(`Builder API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // ===== MARKET DATA =====

  async getMarkets(options: {
    status?: 'pending' | 'active' | 'resolved' | 'canceled';
    creator?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<BuilderMarket[]> {
    const params = new URLSearchParams();
    if (options.status) params.append('status', options.status);
    if (options.creator) params.append('creator', options.creator);
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());

    const endpoint = `/markets${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request<BuilderMarket[]>(endpoint, {}, false, true);
  }

  async getMarket(marketId: string): Promise<BuilderMarket> {
    return this.request<BuilderMarket>(`/markets/${marketId}`, {}, false, true);
  }

  async getMarketBySlug(slug: string): Promise<BuilderMarket | null> {
    try {
      // First get all active markets and filter by slug
      const markets = await this.getMarkets({ status: 'active', limit: 100 });
      const market = markets.find(m => m.slug === slug);
      
      if (market) {
        return this.getMarket(market.id);
      }
      
      return null;
    } catch (error) {
      console.error('Error finding market by slug:', error);
      return null;
    }
  }

  async getActiveMarkets(limit: number = 50): Promise<BuilderMarket[]> {
    return this.getMarkets({ status: 'active', limit });
  }

  async getTrendingMarkets(limit: number = 10): Promise<BuilderMarket[]> {
    const markets = await this.getActiveMarkets(50);
    
    // Sort by volume24h if available, otherwise by total volume
    return markets
      .sort((a, b) => {
        const volumeA = a.volume24h || a.volume;
        const volumeB = b.volume24h || b.volume;
        return volumeB - volumeA;
      })
      .slice(0, limit);
  }

  async getNewMarkets(limit: number = 10): Promise<BuilderMarket[]> {
    const markets = await this.getActiveMarkets(50);
    
    // Sort by creation date
    return markets
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // ===== TRADES & ORDERS =====

  async getMarketTrades(
    marketId: string,
    limit: number = 50
  ): Promise<BuilderTrade[]> {
    const endpoint = `/trades?marketId=${marketId}&limit=${limit}`;
    return this.request<BuilderTrade[]>(endpoint, {}, true, false); // Don't cache trades
  }

  async getMarketOrders(
    marketId: string,
    status?: 'open' | 'filled' | 'cancelled'
  ): Promise<BuilderOrder[]> {
    const params = new URLSearchParams();
    params.append('marketId', marketId);
    if (status) params.append('status', status);
    
    const endpoint = `/orders?${params.toString()}`;
    return this.request<BuilderOrder[]>(endpoint, {}, true, false);
  }

  // ===== ACCOUNT INFO =====

  async getAccountInfo(): Promise<BuilderAccount> {
    return this.request<BuilderAccount>('/account/info', {}, true);
  }

  async getAccountBalance(): Promise<{
    usdcBalance: number;
    totalPortfolioValue: number;
    availableBalance: number;
    lockedBalance: number;
  }> {
    return this.request('/account/balance', {}, true);
  }

  // ===== CATEGORIES =====

  async getCategories(): Promise<string[]> {
    const cacheKey = 'categories';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const markets = await this.getActiveMarkets(100);
    const categories = new Set<string>();
    
    markets.forEach(market => {
      // Extract category from market data
      if (market.resolutionSource) {
        const category = this.extractCategoryFromResolution(market.resolutionSource);
        if (category) categories.add(category);
      }
    });

    const defaultCategories = [
      'Politics', 'Sports', 'Crypto', 'Technology', 'Finance',
      'Entertainment', 'World Events', 'Science', 'Health', 'Environment'
    ];

    const result = Array.from(categories).length > 0 
      ? Array.from(categories).sort()
      : defaultCategories;

    this.setCache(cacheKey, result);
    return result;
  }

  private extractCategoryFromResolution(resolutionSource: string): string | null {
    const source = resolutionSource.toLowerCase();
    
    if (source.includes('election') || source.includes('politics') || source.includes('trump')) {
      return 'Politics';
    }
    if (source.includes('sports') || source.includes('nba') || source.includes('nfl')) {
      return 'Sports';
    }
    if (source.includes('crypto') || source.includes('bitcoin') || source.includes('ethereum')) {
      return 'Crypto';
    }
    if (source.includes('tech') || source.includes('apple') || source.includes('google')) {
      return 'Technology';
    }
    if (source.includes('finance') || source.includes('stock') || source.includes('economy')) {
      return 'Finance';
    }
    
    return null;
  }

  // ===== CACHE MANAGEMENT =====

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.getAccountInfo();
      return true;
    } catch (error) {
      console.error('Builder API connection test failed:', error);
      return false;
    }
  }
}

export const builderAPIClient = new PolymarketBuilderAPIClient();