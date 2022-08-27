from dataclasses import dataclass
from typing import Optional


from fastapi import APIRouter

from api.controllers.covalent import CovalentServiceController

portfolio_router = APIRouter(prefix="/api/v1", tags=["billing_status"])


@portfolio_router.get("/portfolio_value/{address}")
async def get_portfolio_value(address: str):
    """
    Returns the low and high portfolio value over time for a given address.
    """
    jackass = CovalentServiceController(address)
    return [[x for x, y in jackass.getLowHigh()], [y for x, y in jackass.getLowHigh()]]
