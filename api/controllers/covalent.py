import json

from api.services.covalent.balances import getHistoricalPortfolioValueOverTime


class CovalentServiceController:
    def __init__(self, address):
        # self.chainid = chainid
        self.address = address

    def getLowHigh(self):
        """
        Returns the low and high portfolio value over time for a given address.
        """
        # result = getHistoricalPortfolioValueOverTime(self.chainid, self.address)
        data = {1: "eth", 137: "matic", 250: "fantom", 56: "bsc", 43114: "avax"}
        response = []
        if self.address == "0xa79e63e78eec28741e711f89a672a4c40876ebf3":
            for value in data.values():
                with open(f"portfolio_{value}.json", "r") as f:
                    result = json.load(f)
                response.extend(
                    [
                        item["contract_name"],
                        int(item["holdings"][0]["close"]["balance"])
                        / 10 ** item["contract_decimals"],
                    ]
                    for item in result["data"]["items"]
                )

            return sorted(response, key=lambda x: x[1])
        else:
            for chainId in data:
                result = getHistoricalPortfolioValueOverTime(chainId, self.address)
                response = [
                    [
                        item["contract_name"],
                        int(item["holdings"][0]["close"]["balance"])
                        / 10 ** item["contract_decimals"],
                    ]
                    for item in result["data"]["items"]
                ]

        return sorted(response, key=lambda item: item[1])
