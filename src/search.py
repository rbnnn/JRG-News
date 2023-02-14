import requests
import json
import config
import parameters

import sys
query = "global warming"       #sys.argv[1]
topic = ''                     #sys.argv[2]
page = 1

url = "https://api.newscatcherapi.com/v2/search"

params = {
        'q': query,                     # searches for string in title & summary
        'topic': topic,                 # searches for topic tag
        'lang': parameters.lang[11],    # in english
        'sources': parameters.sources,  # uses sources list to filter results
        'sort_by': 'date',              # newest first
        'to_rank': 10000,
        'page_size': 1,
        'page': page
}

headers = {
    "x-api-key": config.api_key
}

response = requests.request("GET", url, headers=headers, params=params)

# encodes json text
results = json.loads(response.text.encode())

# formats & dumps json
with open('result.json', 'w') as f:
    json.dump(results, f, ensure_ascii=False, indent=4)

if response.status_code == 200:
    print('Done')
else:
    print(results)
    print('ERROR: API call failed.')