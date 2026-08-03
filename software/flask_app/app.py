import requests
from flask import render_template
from flask_base import app
from ha_routes import *
from helpers import get_all_states


def load_home_assistant_states():
    try:
        states = get_all_states()
    except (requests.RequestException, ValueError):
        app.logger.exception("Unable to load Home Assistant states at startup")
        states = []

    # Index the API response so the frontend can look up an entity directly,
    # e.g. homeAssistantStates["light.dining_room_light"].state.
    app.config["HOME_ASSISTANT_STATES"] = {
        state["entity_id"]: state
        for state in states
        if isinstance(state, dict) and "entity_id" in state
    }


load_home_assistant_states()


@app.context_processor
def inject_home_assistant_states():
    return {"home_assistant_states": app.config["HOME_ASSISTANT_STATES"]}

@app.route("/living_room_1136x640")
def living_room_1136x640():
    return render_template("rooms/living_room_1136x640.html")

@app.route("/living_room_960x640")
def living_room_960x640():
    return render_template("rooms/living_room_960x640.html")

@app.route("/office")
def office():
    return render_template("rooms/office.html")

@app.route("/office_1136x640")
def office_1136x640():
    return render_template("rooms/office_1136x640.html")

@app.route("/libbys_office")
def libbys_office():
    return render_template("rooms/libbys_office.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
