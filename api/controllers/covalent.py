import json

from api.services.covalent.balances import getHistoricalPortfolioValueOverTime


class CovalentServiceController:
    def __init__(self, chainid, address):
        self.chainid = chainid
        self.address = address

    def getLowHigh(self):
        """
        Returns the low and high portfolio value over time for a given address.
        """
        # result = getHistoricalPortfolioValueOverTime(self.chainid, self.address)
        data = {1: "eth", 137: "matic", 250: "fantom", 56: "bsc", 43114: "avax"}
        full_data = {}
        for value in data.values():
            with open(f"portfolio_{value}.json", "r") as f:
                result = json.load(f)
            response = {}
            for item in result["data"]["items"]:
                response[item["contract_name"]] = {}
                timestamp = []
                close = []
                contract_decimals = item["contract_decimals"]
                for holding in item["holdings"]:
                    timestamp.append(holding["timestamp"])
                    close.append(
                        int(holding["close"]["balance"]) / 10**contract_decimals
                    )
                response[item["contract_name"]]["timestamp"] = timestamp
                response[item["contract_name"]]["close"] = close
            full_data[value] = response
        return full_data
