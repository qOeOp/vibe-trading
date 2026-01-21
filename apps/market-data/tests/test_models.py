"""Test Pydantic models"""

import pytest
from src.models.shenwan import FirstLevelIndustry, SecondLevelIndustry, ThirdLevelIndustry, ConstituentStock


def test_first_level_industry_model():
    """Test FirstLevelIndustry model validation"""
    data = {
        "code": "801010",
        "name": "农林牧渔",
        "constituent_count": 100,
        "static_pe_ratio": 25.5,
        "ttm_pe_ratio": 26.3,
        "pb_ratio": 2.1,
        "dividend_yield": 1.5,
    }
    industry = FirstLevelIndustry(**data)
    assert industry.code == "801010"
    assert industry.name == "农林牧渔"
    assert industry.constituent_count == 100


def test_second_level_industry_model():
    """Test SecondLevelIndustry model with parent"""
    data = {
        "code": "801011",
        "name": "种植业",
        "constituent_count": 50,
        "parent_industry": "农林牧渔",
        "static_pe_ratio": 24.0,
        "ttm_pe_ratio": 25.0,
        "pb_ratio": 2.0,
        "dividend_yield": 1.2,
    }
    industry = SecondLevelIndustry(**data)
    assert industry.parent_industry == "农林牧渔"


def test_third_level_industry_model():
    """Test ThirdLevelIndustry model"""
    data = {
        "code": "850111",
        "name": "饲料",
        "constituent_count": 30,
        "static_pe_ratio": 20.0,
        "ttm_pe_ratio": 21.0,
        "pb_ratio": 1.8,
        "dividend_yield": 1.0,
    }
    industry = ThirdLevelIndustry(**data)
    assert industry.code == "850111"


def test_constituent_stock_model():
    """Test ConstituentStock model"""
    data = {
        "serial_number": 1,
        "stock_code": "000001",
        "stock_name": "平安银行",
        "inclusion_date": "2021-01-01",
        "sw_level1": "金融",
        "sw_level2": "银行",
        "sw_level3": "银行",
        "price": 15.5,
        "pe_ratio": 8.2,
        "ttm_pe_ratio": 8.5,
        "pb_ratio": 0.9,
        "dividend_yield": 3.2,
        "market_cap": 3000.0,
        "net_profit_yoy_q3": 10.5,
        "net_profit_yoy_q2": 12.3,
        "revenue_yoy_q3": 8.9,
        "revenue_yoy_q2": 9.1,
    }
    stock = ConstituentStock(**data)
    assert stock.stock_code == "000001"
    assert stock.stock_name == "平安银行"


def test_model_with_null_values():
    """Test models handle null values correctly"""
    data = {
        "code": "801010",
        "name": "农林牧渔",
        "constituent_count": 100,
        "static_pe_ratio": None,
        "ttm_pe_ratio": None,
        "pb_ratio": None,
        "dividend_yield": None,
    }
    industry = FirstLevelIndustry(**data)
    assert industry.static_pe_ratio is None
