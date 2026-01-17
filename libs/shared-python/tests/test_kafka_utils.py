"""Tests for Kafka utilities."""

from vibetrading.kafka_utils import parse_kafka_brokers, get_kafka_brokers


def test_parse_kafka_brokers_single():
    """Test parsing single broker."""
    result = parse_kafka_brokers("localhost:9092")
    assert result == ["localhost:9092"]


def test_parse_kafka_brokers_multiple():
    """Test parsing multiple brokers."""
    result = parse_kafka_brokers("broker1:9092, broker2:9092, broker3:9092")
    assert result == ["broker1:9092", "broker2:9092", "broker3:9092"]


def test_parse_kafka_brokers_strips_whitespace():
    """Test that whitespace is stripped."""
    result = parse_kafka_brokers("  broker1:9092  ,  broker2:9092  ")
    assert result == ["broker1:9092", "broker2:9092"]


def test_get_kafka_brokers_default():
    """Test default broker value."""
    result = get_kafka_brokers()
    assert result == "localhost:8207"
