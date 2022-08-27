from dataclasses import dataclass
from typing import Optional


from fastapi import APIRouter

data_router = APIRouter(prefix="/api/v1", tags=["data"])


@data_router.get("/data/{address}")
async def get_data(address: str):
    """
    Returns the low and high portfolio value over time for a given address.
    """
    return {
        "x": [1300, 1800, 756, 324, 782, 564, 237, 422],
        "y": ["BTC", "ETH", "USDT", "USDC", "FIL", "MATIC", "BNB", "SOL"],
    }
