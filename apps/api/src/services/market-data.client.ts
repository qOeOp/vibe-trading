/**
 * HTTP client for market-data microservice
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { serviceDiscovery } from './service-discovery.client';
import type {
  FirstLevelIndustry,
  SecondLevelIndustry,
  ThirdLevelIndustry,
  ConstituentStock,
  MarketDataError,
} from '../types/shenwan.types';

export class MarketDataClient {
  private client: AxiosInstance | null = null;
  private baseURL: string | null = null;

  /**
   * Initialize client with service discovery.
   * Called lazily on first request.
   */
  private async ensureClient(): Promise<AxiosInstance> {
    if (this.client && this.baseURL) {
      return this.client;
    }

    // Discover market-data service address from Consul
    this.baseURL = await serviceDiscovery.discoverService(
      'market-data',
      'MARKET_DATA_URL' // Fallback env var
    );

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Error interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<MarketDataError>) => {
        if (error.response) {
          console.error(`Market-data error: ${error.response.status}`, error.response.data);
        } else if (error.request) {
          console.error('Market-data service unavailable:', error.message);
          // Invalidate cached address on connection failure
          this.client = null;
          this.baseURL = null;
        } else {
          console.error('Request setup error:', error.message);
        }
        throw error;
      }
    );

    return this.client;
  }

  async getFirstLevelIndustries(forceRefresh = false): Promise<FirstLevelIndustry[]> {
    const client = await this.ensureClient();
    const response = await client.get<FirstLevelIndustry[]>('/api/shenwan/industries/first', {
      params: { force_refresh: forceRefresh },
    });
    return response.data;
  }

  async getSecondLevelIndustries(forceRefresh = false): Promise<SecondLevelIndustry[]> {
    const client = await this.ensureClient();
    const response = await client.get<SecondLevelIndustry[]>('/api/shenwan/industries/second', {
      params: { force_refresh: forceRefresh },
    });
    return response.data;
  }

  async getThirdLevelIndustries(forceRefresh = false): Promise<ThirdLevelIndustry[]> {
    const client = await this.ensureClient();
    const response = await client.get<ThirdLevelIndustry[]>('/api/shenwan/industries/third', {
      params: { force_refresh: forceRefresh },
    });
    return response.data;
  }

  async getConstituents(symbol: string, forceRefresh = false): Promise<ConstituentStock[]> {
    const client = await this.ensureClient();
    const response = await client.get<ConstituentStock[]>(
      `/api/shenwan/constituents/${encodeURIComponent(symbol)}`,
      { params: { force_refresh: forceRefresh } }
    );
    return response.data;
  }
}

export const marketDataClient = new MarketDataClient();
