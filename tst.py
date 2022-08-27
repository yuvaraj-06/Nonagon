import requests

url = "https://api.opensea.io/api/v1/asset_contract/0x06012c8cf97bead5deae237070f9587f8e7a266d"

response = requests.get(url)

print(response.text)