from api.services.covalent.balances import getHistoricalPortfolioValueOverTime


class CovalentServiceController:
    def __init__(self):
        pass

    def getLowHigh(self, chainid, address):
        """
        Returns the low and high portfolio value over time for a given address.
        """
        result = getHistoricalPortfolioValueOverTime(chainid, address)
        response = {}
        for item in result["items"]:
            response[item["contract_name"]] = {}
            timestamp = []
            close = []
            contract_decimals = item["contract_decimals"]
            for holding in item["holdings"]:
                timestamp.append(holding["timestamp"])
                close.append(holding["close"]["close"] / 10**contract_decimals)
            response[item["contract_name"]]["timestamp"] = timestamp
            response[item["contract_name"]]["close"] = close
        return response
