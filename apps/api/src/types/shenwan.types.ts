/**
 * Shenwan industry classification types
 */

export interface IndustryInfoBase {
  code: string;
  name: string;
  constituent_count: number;
  static_pe_ratio: number | null;
  ttm_pe_ratio: number | null;
  pb_ratio: number | null;
  dividend_yield: number | null;
}

export interface FirstLevelIndustry extends IndustryInfoBase {}

export interface SecondLevelIndustry extends IndustryInfoBase {
  parent_industry: string;
}

export interface ThirdLevelIndustry extends IndustryInfoBase {}

export interface ConstituentStock {
  serial_number: number;
  stock_code: string;
  stock_name: string;
  inclusion_date: string;
  sw_level1: string;
  sw_level2: string;
  sw_level3: string;
  price: number | null;
  pe_ratio: number | null;
  ttm_pe_ratio: number | null;
  pb_ratio: number | null;
  dividend_yield: number | null;
  market_cap: number | null;
  net_profit_yoy_q3: number | null;
  net_profit_yoy_q2: number | null;
  revenue_yoy_q3: number | null;
  revenue_yoy_q2: number | null;
}

export interface MarketDataError {
  detail: string;
}
