from flask import jsonify, make_response, request
from flask_base import app
from helpers import call_service, get_all_states, get_state


@app.route("/ha_state/<path:entity_id>", methods=['GET'])
def ha_state(entity_id):
    """Return one fresh Home Assistant state for the browser state manager."""
    response = make_response(jsonify(get_state(entity_id)))
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/ha_states", methods=['GET'])
def ha_states():
    """Return all current Home Assistant states for the browser."""
    response = make_response(jsonify(get_all_states()))
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/vacuum_start", methods=['GET', 'POST'])
def vacuum_start():
    call_service("button", "press", {
        "entity_id": "button.s8_maxv_ultra_lvg_hall_bath_bed"
    })
    return '', 204

@app.route("/vacuum_stop", methods=['GET', 'POST'])
def vacuum_stop():
    call_service("vacuum", "stop", {
        "entity_id": "vacuum.s8_maxv_ultra"
    })
    return '', 204

@app.route("/office_lights_off", methods=['GET', 'POST'])
def office_lights_off():
    call_service(
        "script",
        "turn_off_all_office_lights",
        {}
    )
    return '', 204

@app.route("/3d_printer_toggle", methods=['GET', 'POST'])
def _3d_printer_toggle():
    call_service(
        "switch",
        "toggle",
        {"entity_id": "switch.3d_printer"}
    )
    return '', 204

@app.route("/set_message", methods=['POST'])
def set_message():
    call_service(
        "input_text",
        "set_value",
        {
            "entity_id": request.form.get("entity_id", ""),
            "value": request.form.get("message", ""),
        },
    )
    return '', 204

@app.route("/ice_maker_toggle", methods=['GET', 'POST'])
def ice_maker_toggle():
    call_service(
        "switch",
        "toggle",
        {"entity_id": "switch.opal"}
    )
    return '', 204

@app.route("/living_room_toggle", methods=['GET', 'POST'])
def living_room_toggle():
    call_service(
        "switch",
        "toggle",
        {"entity_id": "switch.living_room_light"}
    )
    return '', 204

@app.route("/dining_room_toggle", methods=['GET', 'POST'])
def dining_room_toggle():
    call_service(
        "light",
        "toggle",
        {"entity_id": "light.dining_room_light"}
    )
    return '', 204

@app.route("/downstairs_toggle", methods=['GET', 'POST'])
def downstairs_toggle():
    call_service(
        "script",
        "toggle_downstairs_lights",
        {}
    )
    return '', 204

@app.route("/playpause", methods=['GET', 'POST'])
def playpause():
    print("Toggling TV play/pause")
    call_service(
        "script",
        "play_pause",
        {}
    )
    return '', 204

@app.route("/office_fans_lights_toggle", methods=['GET', 'POST'])
def office_fans_lights_toggle():
    call_service(
        "script",
        "toggle_office_fan_lights",
        {}
    )
    return '', 204

@app.route("/office_ceiling_lights_toggle", methods=['GET', 'POST'])
def office_ceiling_lights_toggle():
    call_service(
        "script",
        "toggle_office_ceiling_lights",
        {}
    )
    return '', 204

@app.route("/office_lamps_toggle", methods=['GET', 'POST'])
def office_lamps_toggle():
    call_service(
        "script",
        "toggle_office_lamps",
        {}
    )
    return '', 204

@app.route("/libbys_office_lights_toggle", methods=['GET', 'POST'])
def libbys_office_lights_toggle():
    call_service(
        "switch",
        "toggle",
        {"entity_id": "switch.libby_s_office_lamp"}
    )
    return '', 204

@app.route("/eloise_lamp_toggle", methods=['GET', 'POST'])
def eloise_lamp_toggle():
    call_service(
        "switch",
        "toggle",
        {"entity_id": "switch.eloise_s_lamp"}
    )
    return '', 204
