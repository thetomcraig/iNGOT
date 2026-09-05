import requests
from flask import render_template
from flask_base import app
from ha_routes import *
from helpers import get_all_states, get_outside_temperature, calculate_plants


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
    # print(outside_temp)
    # print("app.jinja_env")
    # print(app.jinja_env)
    # print(dir(app.jinja_env))
    # print(app.jinja_env.list_templates())
    # print("app.jinja_env.get_template")
    # print(app.jinja_env.get_template("components/buttons/api_call_buttons.html"))
    # print("dir(app.jinja_env.get_template")
    # print(dir(app.jinja_env.get_template("components/buttons/api_call_buttons.html")))
    # print("app.jinja_env.get_template(components/buttons/api_call_buttons.html.module-")
    # print(app.jinja_env.get_template("components/buttons/api_call_buttons.html").module)
    # template = app.jinja_env.get_template(
    # "components/buttons/api_call_buttons.html"
    # )
    # module = template.make_module()
    # print('module')
    # print(module)
    # print(dir(module))
    # print(module.inside_soil_moisture)
    # template = app.jinja_env.get_template(
    #     "components/buttons/api_call_buttons.html"
    # )

    # macros = template.make_module()

    # macro_map = {
    #     "sensor.inside_soil_soil_moisture": macros.inside_soil_moisture,
    #     "sensor.dining_room_light": macros.dining_room_light,
    #     "sensor.vacuum_start": macros.vacuum_start,
    # }
    # print(macro_map)

    # Pulling out into its own var for convenience
    eloise_temp = round(float(ha_states.get("sensor.eloise_s_room_temp_temperature", {}).get('state', 0.0)))
    # Translate soil information to color-coded severity levels
    plants_dict = calculate_plants(ha_states)
    data = {
        "plants": plants_dict,
        "outside_temp": outside_temp,
        "eloise_temp": eloise_temp,
        "home_assistant_states": ha_states,
    }
    return data

@app.route("/ingot_dark_green")
@app.route("/office_960x640")
def office_960x640():
    macro_names = ["office_lamps_toggle"]
    template = app.jinja_env.get_template(
        "components/buttons/api_call_buttons.html"
    )
    macros = template.make_module()
    selected_macros = [
        getattr(macros, name)
        for name in macro_names
    ]
    print(selected_macros)
    return render_template("rooms/office_960x640.html", macros=selected_macros)

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
