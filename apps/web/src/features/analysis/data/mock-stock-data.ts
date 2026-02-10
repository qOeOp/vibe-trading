// Mock OHLCV data for candlestick charts
export interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  last: number;
  change: number;
  changePercent: number;
  icon?: string;
}

export interface StockInfo {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  price: number;
  change: number;
  changePercent: number;
  preMarketPrice?: number;
  preMarketChange?: number;
  preMarketChangePercent?: number;
  lastUpdate: string;
}

export interface AlertItem {
  id: string;
  title: string;
  symbol: string;
  timeframe: string;
  status: "active" | "triggered" | "stopped";
  type?: string;
}

// Generate realistic AAPL-like price data
function generateCandleData(
  basePrice: number,
  days: number,
  volatility = 0.02
): CandleData[] {
  const data: CandleData[] = [];
  let currentPrice = basePrice;
  const startDate = new Date("2024-10-01");

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const dailyChange = (Math.random() - 0.48) * volatility * currentPrice;
    const open = currentPrice;
    const close = currentPrice + dailyChange;

    const intraHighExtra = Math.random() * volatility * 0.5 * currentPrice;
    const intraLowExtra = Math.random() * volatility * 0.5 * currentPrice;

    const high = Math.max(open, close) + intraHighExtra;
    const low = Math.min(open, close) - intraLowExtra;

    const baseVolume = 50000000;
    const volume = Math.floor(baseVolume * (0.5 + Math.random()));

    data.push({
      date: date.toISOString().split("T")[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    currentPrice = close;
  }

  return data;
}

// Stock-specific data generators
export const STOCK_DATA: Record<string, CandleData[]> = {
  AAPL: generateCandleData(175, 120, 0.018),
  MSFT: generateCandleData(380, 120, 0.016),
  GOOGL: generateCandleData(140, 120, 0.02),
  AMZN: generateCandleData(178, 120, 0.022),
  NVDA: generateCandleData(480, 120, 0.035),
  TSLA: generateCandleData(240, 120, 0.04),
  META: generateCandleData(500, 120, 0.025),
  SPX: generateCandleData(5800, 120, 0.012),
  NDQ: generateCandleData(20500, 120, 0.015),
  DJI: generateCandleData(42000, 120, 0.01),
};

export function getStockData(symbol: string): CandleData[] {
  return STOCK_DATA[symbol] || STOCK_DATA["AAPL"];
}

// Watchlist data
export const WATCHLIST_INDICES: WatchlistItem[] = [
  { symbol: "AAPL", name: "Apple Inc", last: 911.3, change: 29.07, changePercent: 3.19 },
  { symbol: "SPX", name: "S&P 500", last: 6086.37, change: 37.13, changePercent: 0.61 },
  { symbol: "NDQ", name: "Nasdaq", last: 22888.5, change: 304.42, changePercent: 1.33 },
  { symbol: "DJI", name: "Dow Jones", last: 45056.73, change: -792.99, changePercent: -1.76 },
];

export const WATCHLIST_SHARES: WatchlistItem[] = [
  { symbol: "NVDA", name: "NVIDIA", last: 875.42, change: 23.18, changePercent: 2.72 },
  { symbol: "MSFT", name: "Microsoft", last: 428.52, change: 8.24, changePercent: 1.96 },
  { symbol: "GOOGL", name: "Alphabet", last: 175.23, change: -2.14, changePercent: -1.21 },
  { symbol: "AMZN", name: "Amazon", last: 198.76, change: 4.32, changePercent: 2.22 },
  { symbol: "TSLA", name: "Tesla", last: 248.92, change: -8.45, changePercent: -3.28 },
  { symbol: "META", name: "Meta", last: 582.14, change: 15.67, changePercent: 2.77 },
];

export const WATCHLIST_FUTURES: WatchlistItem[] = [
  { symbol: "ES", name: "E-mini S&P", last: 6095.25, change: 12.5, changePercent: 0.21 },
  { symbol: "NQ", name: "E-mini Nasdaq", last: 22145.0, change: 85.25, changePercent: 0.39 },
  { symbol: "CL", name: "Crude Oil", last: 71.24, change: -0.82, changePercent: -1.14 },
  { symbol: "GC", name: "Gold", last: 2645.3, change: 8.2, changePercent: 0.31 },
];

export const WATCHLIST_CRYPTO: WatchlistItem[] = [
  { symbol: "BTC", name: "Bitcoin", last: 97245.82, change: 2145.32, changePercent: 2.26 },
  { symbol: "ETH", name: "Ethereum", last: 3428.56, change: -45.23, changePercent: -1.30 },
  { symbol: "SOL", name: "Solana", last: 198.42, change: 12.84, changePercent: 6.92 },
];

// Stock info
export const STOCK_INFO: Record<string, StockInfo> = {
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc",
    exchange: "Nasdaq",
    sector: "Electronic Technology",
    industry: "Telecommunications Equipment",
    price: 911.3,
    change: 28.84,
    changePercent: 3.19,
    preMarketPrice: 911.07,
    preMarketChange: 28.75,
    preMarketChangePercent: 3.17,
    lastUpdate: "03:41 PM, UTC-5",
  },
  NVDA: {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    exchange: "Nasdaq",
    sector: "Electronic Technology",
    industry: "Semiconductors",
    price: 875.42,
    change: 23.18,
    changePercent: 2.72,
    preMarketPrice: 878.25,
    preMarketChange: 26.01,
    preMarketChangePercent: 3.05,
    lastUpdate: "03:41 PM, UTC-5",
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    exchange: "Nasdaq",
    sector: "Technology Services",
    industry: "Packaged Software",
    price: 428.52,
    change: 8.24,
    changePercent: 1.96,
    lastUpdate: "03:41 PM, UTC-5",
  },
  TSLA: {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    exchange: "Nasdaq",
    sector: "Consumer Durables",
    industry: "Motor Vehicles",
    price: 248.92,
    change: -8.45,
    changePercent: -3.28,
    lastUpdate: "03:41 PM, UTC-5",
  },
};

export function getStockInfo(symbol: string): StockInfo {
  return (
    STOCK_INFO[symbol] || {
      symbol,
      name: symbol,
      exchange: "NYSE",
      sector: "Unknown",
      industry: "Unknown",
      price: 100,
      change: 0,
      changePercent: 0,
      lastUpdate: "N/A",
    }
  );
}

// Alerts
export const MOCK_ALERTS: AlertItem[] = [
  {
    id: "1",
    title: "DJI (DJ) Crossing 44,100.00 on AAPL, 1D",
    symbol: "AAPL",
    timeframe: "1D",
    status: "triggered",
    type: "Stopped - Triggered",
  },
  {
    id: "2",
    title: "NDQ (TVC) Crossing Down SPX (SP) on AAPL, 1D",
    symbol: "AAPL",
    timeframe: "1D",
    status: "active",
    type: "NDQ High",
  },
  {
    id: "3",
    title: "AAPL Crossing Down 900.00",
    symbol: "AAPL",
    timeframe: "1D",
    status: "active",
  },
];

// Calculate SMA
export function calculateSMA(data: CandleData[], period: number): (number | null)[] {
  const sma: (number | null)[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      sma.push(Number((sum / period).toFixed(2)));
    }
  }

  return sma;
}
