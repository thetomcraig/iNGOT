import requests

import logging
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
    url = f"{ENV_VAR['HA_URL']}/api/services/{domain}/{service}"
    if rest_method == "POST":
        return requests.post(url, headers=HEADERS, json=payload)
    elif rest_method == "GET":
        return requests.get(url, headers=HEADERS, json=payload)


def get_all_states():
    """Return the current state objects in HA"""
    response = requests.get(f"{ENV_VARS['HA_URL']}/api/states", headers=HEADERS, timeout=10,)
    response.raise_for_status()
    return response.json()


def get_outside_temperature():
    """
    Fetch outside temperature from Open-Meteo API for Los Angeles area.
    
    Returns:
        float: Temperature in Fahrenheit, or None if the request fails.
    """
    try:
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": 34.17,
            "longitude": -118.26,
            "current": "temperature_2m,weather_code",
            "hourly": "temperature_2m,precipitation_probability,weather_code",
            "daily": "temperature_2m_max,temperature_2m_min,weather_code",
            "temperature_unit": "fahrenheit",
            "timezone": "auto"
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        temperature = data["current"]["temperature_2m"]
        
        return int(round(float(temperature)))
    except (requests.RequestException, KeyError, ValueError):
        # Return None if there's any error in fetching or parsing data
        return None

def calculate_plants(ha_states):
    plant_entities = ["sensor.inside_soil_soil_moisture"]
    entity_to_state = {entity: ha_states.get(entity) for entity in plant_entities}
    for entity, state in entity_to_state.items():
        # Fallback, if anything else fails
        entity_to_state[entity] = {"color": "black"}
        if state is None:
            logger.info(f"HA state is None! {entity_to_state}")
            return entity_to_state
        else:
            int_value = int(float(state.get("state", 0)))
            if 0 < int_value < 10:
                entity_to_state[entity]["color"] = "red"
            if 10 <= int_value < 30:
                entity_to_state[entity]["color"] = "dark_orange"
            if 30 <= int_value < 50:
                entity_to_state[entity]["color"] = "light_orange"
            if 50 <= int_value:
                entity_to_state[entity]["color"] = "green"
    return entity_to_state