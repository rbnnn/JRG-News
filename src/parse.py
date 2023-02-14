import requests
import json
import config

# parse url
url = 'https://news-parser1.p.rapidapi.com/article_v1'

headers = {
    "x-rapidapi-key": config.api_key
}

params = {
    'url': 'https://www.forbes.com/sites/billybambrough/2023/02/11/100-billion-per-month-legendary-trader-makes-surprise-crypto-u-turn-after-huge-bitcoin-ethereum-bnb-xrp-cardano-dogecoin-polygon-and-solana-price-swings/'
}

# calls api
response = requests.request("GET", url, headers=headers, params=params)

'''
results = json.loads(response.text.encode())

with open('article.json', 'w') as f:
    json.dump(results, f, ensure_ascii=False, indent=4)
'''

print(response.text)

if response.status_code == 200:
    print('Done')
else:
    print('ERROR: API call failed.')