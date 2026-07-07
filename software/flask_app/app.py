import requests
from flask import Flask, render_template

app = Flask(__name__)

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
    url = f"{HA_URL}/api/services/{domain}/{service}"
    if rest_method == "POST":
        return requests.post(url, headers=HEADERS, json=payload)
    elif rest_method == "GET":
        return requests.get(url, headers=HEADERS, json=payload)

@app.route("/eloises_temp", methods=['GET', 'POST'])
def eloises_temp():
    response = requests.get(
        f"{HA_URL}/api/states/sensor.eloise_s_room_temp_temperature",
        headers=HEADERS,
    )
    response.raise_for_status()
    sensor = response.json()
    temp = round(float(sensor.get("state", "")))
    return f"{temp}°"

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

@app.route("/playpause")
def playpause():
    call_service("media_player", "media_play_pause", {"entity_id": "media_player.tv"})
    return '', 204

@app.route("/office_fans_toggle", methods=['GET', 'POST'])
def office_fans_toggle():
    call_service(
        "script",
        "toggle_office_fan_lights",
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

@app.route("/living_room")
def index():
    return render_template("living_room.html")

@app.route("/office")
def office():
    return render_template("office.html")

@app.route("/play_room")
def play_room():
    return render_template("play_room.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
