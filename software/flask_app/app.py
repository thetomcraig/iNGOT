import requests
from flask import render_template
from flask_base import app
from ha_routes import *
from helpers import get_all_states, get_outside_temperature


def load_home_assistant_states():
    try:
        states = get_all_states()
    except (requests.RequestException, ValueError):
        app.logger.exception("Unable to load Home Assistant states at startup")
        states = []

    return {
        state["entity_id"]: state
        for state in states
        if isinstance(state, dict) and "entity_id" in state
    }


@app.context_processor
def inject_data():
    ha_states = load_home_assistant_states()
    outside_temp = get_outside_temperature()
    # Pulling out into its own var for convenience
    eloise_temp = round(float(ha_states.get("sensor.eloise_s_room_temp_temperature", {}).get('state', 0.0)))
    data = {
        "outside_temp": outside_temp,
        "eloise_temp": eloise_temp,
        "home_assistant_states": ha_states,
    }
    return data

@app.route("/ingot_dark_green")
@app.route("/office_960x640")
def office_960x640():
    return render_template("rooms/office_960x640.html")

@app.route("/guest_room_960x640")
def guest_room_960x640():
    return render_template("rooms/guest_room_960x640.html")

@app.route("/ingot_green")
@app.route("/living_room_960x640")
def living_room_960x640():
    return render_template("rooms/living_room_960x640.html")

@app.route("/ingot_black")
@app.route("/office_1136x640")
def office_1136x640():
    return render_template("rooms/office_1136x640.html")

@app.route("/ingot_gold")
@app.route("/libbys_office")
def libbys_office():
    return render_template("rooms/libbys_office.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
