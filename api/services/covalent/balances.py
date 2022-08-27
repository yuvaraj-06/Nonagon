import requests
import pandas as pd
import numpy as np

from api import models


def getHistoricalPortfolioValueOverTime(chainid, address):
    """
    Returns the historical portfolio value over time for a given address.
    """
    url = f"https://api.covalenthq.com/v1/{chainid}/address/{address}/portfolio_v2/?key={models.COVALENT_API_KEY}"
    return requests.get(url).json()
