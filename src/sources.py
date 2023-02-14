import requests
import json
import config
import parameters

# retrieves top 100 compatible sources
url = "https://api.newscatcherapi.com/v2/sources"

params = {
    'lang': parameters.lang[11],  # searches for sources in english
    # 'topic':
    # 'countries':
}

headers = {
    "x-api-key": config.api_key
}

# calls api
response = requests.request("GET", url, headers=headers, params=params)

results = json.loads(response.text.encode())

with open('sources.json', 'w') as f:
    json.dump(results, f, ensure_ascii=False, indent=4)

# call indicatior
if response.status_code == 200:
    print('Done')
else:
    print(results)
    print('ERROR: API call failed.')
