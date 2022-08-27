from dataclasses import dataclass
from typing import Optional


from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.params import Form, Body
from fastapi import File, UploadFile
from pydantic import BaseModel

from api.controllers.covalent import CovalentServiceController

portfolio_router = APIRouter(prefix="/api/v1", tags=["billing_status"])


@portfolio_router.get("/portfolio_value/{chainid}/{address}")
async def get_portfolio_value(chainid: str, address: str):
    """
    Returns the low and high portfolio value over time for a given address.
    """
    return CovalentServiceController.getLowHigh(chainid, address)
