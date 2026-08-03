import requests

HA_URL = "http://ariston:8123"
ENV_VARS = {}

with open(".env", "r") as f:
    for line in f:
        key_var = line.split("=")
        ENV_VARS[key_var[0].strip()] = key_var[1].strip()

HEADERS = {
    "Authorization": f"Bearer {ENV_VARS['HA_TOKEN']}",
    "Content-Type": "application/json",
}

def call_service(domain, service, payload, rest_method="POST"):
    print(f"Calling service: {domain}/{service} with payload: {payload}")
    url = f"{HA_URL}/api/services/{domain}/{service}"
    if rest_method == "POST":
        return requests.post(url, headers=HEADERS, json=payload)
    elif rest_method == "GET":
        return requests.get(url, headers=HEADERS, json=payload)

def get_state(entity_id):
    response = requests.get(
        f"{HA_URL}/api/states/{entity_id}",
        headers=HEADERS,
    )
    response.raise_for_status()
    return response.json()


def get_all_states():
    """Return the current state objects in HA"""
    response = requests.get(
        f"{HA_URL}/api/states",
        headers=HEADERS,
        timeout=10,
    )
    response.raise_for_status()
    return response.json()
