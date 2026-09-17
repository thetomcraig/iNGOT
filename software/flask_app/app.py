import requests
import logging
import time
from flask import render_template, request, g
from flask_base import app
from ha_routes import *
from helpers import get_all_states, get_outside_temperature, calculate_plants

# Configure logging to file
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/ingot_app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Add a request logging handler
@app.before_request
def log_request_info():
    g.start_time = time.time()
    logger.info('Request: %s %s from %s - User-Agent: %s', 
                request.method, 
                request.path, 
                request.remote_addr, 
                request.headers.get('User-Agent', ''))

@app.after_request
def log_response_info(response):
    duration = time.time() - g.start_time if hasattr(g, 'start_time') else 0
    logger.info('Response: %s %s - Status: %d - Duration: %.2fs', 
                request.method, 
                request.path, 
                response.status_code, 
                duration)
    return response


def load_home_assistant_states():
    try:
        states = get_all_states()
    except (requests.RequestException, ValueError):
        app.logger.exception("Unable to load Home Assistant states at startup")
        states = []

    entity_states = {
        state["entity_id"]: state
        for state in states
        if isinstance(state, dict) and "entity_id" in state
    }
    return entity_states


@app.context_processor
def inject_data():
    ha_states = load_home_assistant_states()
    outside_temp = get_outside_temperature()
    # Pulling out into its vars for convenience
    eloise_temp = round(float(ha_states.get("sensor.eloise_s_room_temp_temperature", {}).get('state', 0.0)))
    help_text = ha_states.get("input_text.ingot_guest_room_help_message", {}).get('state', "No help text found")
    # Translate soil information to color-coded severity levels
    plants_dict = calculate_plants(ha_states)
    data = {
        "plants": plants_dict,
        "outside_temp": outside_temp,
        "eloise_temp": eloise_temp,
        "guest_room_help_text": help_text,
        "home_assistant_states": ha_states,
    }
    return data

@app.route("/office_960x640")
def office_960x640():
    return render_template("rooms/office_960x640.html")

@app.route("/ingot_green")
@app.route("/bathroom_960x640")
def bathroom_960x640():
    return render_template("rooms/bathroom_960x640.html")

@app.route("/ingot_gold")
@app.route("/guest_room_960x640")
def guest_room_960x640():
    return render_template("rooms/guest_room_960x640.html")

@app.route("/living_room_960x640")
def living_room_960x640():
    return render_template("rooms/living_room_960x640.html")

@app.route("/ingot_black")
@app.route("/office_1136x640")
def office_1136x640():
    return render_template("rooms/office_1136x640.html")

@app.route("/ingot_dark_green")
@app.route("/libbys_office")
def libbys_office():
    return render_template("rooms/libbys_office.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
