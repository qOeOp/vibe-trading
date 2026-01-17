/**
 * Shared TypeScript types for Vibe Trading
 * Used across frontend, API gateway, and other TypeScript services
 */

// Kafka Event Types

export interface MarketTickEvent {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
}

export interface KlineEvent {
  symbol: string;
  interval: string;
  openTime: number;
  closeTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookEvent {
  symbol: string;
  bids: Array<[number, number]>; // [price, quantity]
  asks: Array<[number, number]>;
  timestamp: number;
}

export interface OrderEvent {
  orderId: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop';
  price?: number;
  quantity: number;
  status: 'pending' | 'open' | 'filled' | 'partially_filled' | 'cancelled' | 'rejected';
  timestamp: number;
}

export interface PositionEvent {
  symbol: string;
  side: 'long' | 'short';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
  realizedPnl: number;
  timestamp: number;
}

export interface IndicatorEvent {
  symbol: string;
  indicator: string;
  value: number | Record<string, number>;
  timestamp: number;
}

export interface SignalEvent {
  symbol: string;
  signal: 'buy' | 'sell' | 'hold';
  strength: number; // 0-1
  reason: string;
  timestamp: number;
}

export interface PredictionEvent {
  symbol: string;
  model: string;
  prediction: number;
  confidence: number;
  timestamp: number;
}

// API Response Types

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  service: string;
  version: string;
  uptime?: number;
}

// Configuration Types

export interface KafkaConfig {
  brokers: string[];
  clientId: string;
  groupId?: string;
}

export interface RedisConfig {
  url: string;
  password?: string;
  db?: number;
}
