"""Shenwan industry classification data models"""

from pydantic import BaseModel, Field


class IndustryInfoBase(BaseModel):
    """Base industry information fields"""

    code: str = Field(..., description="行业代码")
    name: str = Field(..., description="行业名称")
    constituent_count: int = Field(..., description="成份个数")
    static_pe_ratio: float | None = Field(None, description="静态市盈率")
    ttm_pe_ratio: float | None = Field(None, description="TTM(滚动)市盈率")
    pb_ratio: float | None = Field(None, description="市净率")
    dividend_yield: float | None = Field(None, description="静态股息率")


class FirstLevelIndustry(IndustryInfoBase):
    """First-level industry classification"""

    pass


class SecondLevelIndustry(IndustryInfoBase):
    """Second-level industry classification with parent"""

    parent_industry: str = Field(..., description="上级行业")


class ThirdLevelIndustry(IndustryInfoBase):
    """Third-level industry classification (most granular)"""

    pass


class ConstituentStock(BaseModel):
    """Constituent stock information for an industry"""

    serial_number: int = Field(..., description="序号")
    stock_code: str = Field(..., description="股票代码")
    stock_name: str = Field(..., description="股票简称")
    inclusion_date: str = Field(..., description="纳入时间")
    sw_level1: str = Field(..., description="申万1级")
    sw_level2: str = Field(..., description="申万2级")
    sw_level3: str = Field(..., description="申万3级")
    price: float | None = Field(None, description="价格")
    pe_ratio: float | None = Field(None, description="市盈率")
    ttm_pe_ratio: float | None = Field(None, description="市盈率TTM")
    pb_ratio: float | None = Field(None, description="市净率")
    dividend_yield: float | None = Field(None, description="股息率(%)")
    market_cap: float | None = Field(None, description="市值(亿元)")
    net_profit_yoy_q3: float | None = Field(None, description="归母净利润同比增长(09-30)(%)")
    net_profit_yoy_q2: float | None = Field(None, description="归母净利润同比增长(06-30)(%)")
    revenue_yoy_q3: float | None = Field(None, description="营业收入同比增长(09-30)(%)")
    revenue_yoy_q2: float | None = Field(None, description="营业收入同比增长(06-30)(%)")
