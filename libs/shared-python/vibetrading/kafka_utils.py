"""Kafka utilities for Vibe Trading services."""

import os
from typing import List, Optional
from aiokafka import AIOKafkaProducer, AIOKafkaConsumer


def get_kafka_brokers() -> str:
    """
    Get Kafka broker addresses from environment.

    Returns:
        Comma-separated list of Kafka broker addresses.
    """
    return os.getenv("KAFKA_BROKERS", "localhost:8207")


def parse_kafka_brokers(brokers: Optional[str] = None) -> List[str]:
    """
    Parse Kafka broker string into list.

    Args:
        brokers: Comma-separated broker addresses. If None, uses get_kafka_brokers().

    Returns:
        List of broker addresses.
    """
    if brokers is None:
        brokers = get_kafka_brokers()
    return [b.strip() for b in brokers.split(",")]


async def create_producer(
    brokers: Optional[str] = None,
    client_id: Optional[str] = None,
    **kwargs
) -> AIOKafkaProducer:
    """
    Create and start a Kafka producer.

    Args:
        brokers: Kafka broker addresses (comma-separated)
        client_id: Client identifier
        **kwargs: Additional producer configuration

    Returns:
        Started AIOKafkaProducer instance
    """
    broker_list = parse_kafka_brokers(brokers)

    producer = AIOKafkaProducer(
        bootstrap_servers=broker_list,
        client_id=client_id,
        **kwargs
    )
    await producer.start()
    return producer


async def create_consumer(
    topics: List[str],
    group_id: str,
    brokers: Optional[str] = None,
    **kwargs
) -> AIOKafkaConsumer:
    """
    Create and start a Kafka consumer.

    Args:
        topics: List of topics to subscribe to
        group_id: Consumer group ID
        brokers: Kafka broker addresses (comma-separated)
        **kwargs: Additional consumer configuration

    Returns:
        Started AIOKafkaConsumer instance
    """
    broker_list = parse_kafka_brokers(brokers)

    consumer = AIOKafkaConsumer(
        *topics,
        bootstrap_servers=broker_list,
        group_id=group_id,
        **kwargs
    )
    await consumer.start()
    return consumer
