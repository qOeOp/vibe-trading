/**
 * Shenwan industry proxy routes
 */

import { Router, Request, Response } from 'express';
import { marketDataClient } from '../services/market-data.client';
import { AxiosError } from 'axios';

const router = Router();

/**
 * GET /api/shenwan/industries/first
 * Proxy to market-data service for first-level industries
 */
router.get('/industries/first', async (req: Request, res: Response) => {
  try {
    const forceRefresh = req.query.force_refresh === 'true';
    const data = await marketDataClient.getFirstLevelIndustries(forceRefresh);
    res.json(data);
  } catch (error) {
    handleMarketDataError(error, res);
  }
});

/**
 * GET /api/shenwan/industries/second
 * Proxy to market-data service for second-level industries
 */
router.get('/industries/second', async (req: Request, res: Response) => {
  try {
    const forceRefresh = req.query.force_refresh === 'true';
    const data = await marketDataClient.getSecondLevelIndustries(forceRefresh);
    res.json(data);
  } catch (error) {
    handleMarketDataError(error, res);
  }
});

/**
 * GET /api/shenwan/industries/third
 * Proxy to market-data service for third-level industries
 */
router.get('/industries/third', async (req: Request, res: Response) => {
  try {
    const forceRefresh = req.query.force_refresh === 'true';
    const data = await marketDataClient.getThirdLevelIndustries(forceRefresh);
    res.json(data);
  } catch (error) {
    handleMarketDataError(error, res);
  }
});

/**
 * GET /api/shenwan/constituents/:symbol
 * Proxy to market-data service for industry constituents
 */
router.get('/constituents/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const forceRefresh = req.query.force_refresh === 'true';
    const data = await marketDataClient.getConstituents(symbol, forceRefresh);
    res.json(data);
  } catch (error) {
    handleMarketDataError(error, res);
  }
});

/**
 * Error handler for market-data service errors
 */
function handleMarketDataError(error: unknown, res: Response): void {
  if (error instanceof AxiosError) {
    if (error.response) {
      // Forward error from market-data service
      res.status(error.response.status).json({
        error: 'Market data service error',
        detail: error.response.data?.detail || error.message,
      });
    } else {
      // Service unavailable
      res.status(503).json({
        error: 'Market data service unavailable',
        detail: 'Could not connect to market-data service',
      });
    }
  } else {
    // Unknown error
    res.status(500).json({
      error: 'Internal server error',
      detail: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default router;
