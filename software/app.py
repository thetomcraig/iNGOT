import requests
from flask import Flask, jsonify, render_template, request, url_for

app = Flask(__name__)

# HA_URL = "http://127.0.0.1:8123"
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

def call_service(domain, service, payload):
    url = f"{HA_URL}/api/services/{domain}/{service}"
    return requests.post(url, headers=HEADERS, json=payload)

from flask import redirect


@app.route("/living_room_toggle", methods=['GET', 'POST'])
def living_room_toggle():
    call_service(
        "switch",
        "toggle",
        {"entity_id": "switch.living_room_light"}
    )
    return redirect(f"{request.referrer or url_for('index')}")

@app.route("/dining_room_toggle", methods=['GET', 'POST'])
def dining_room_toggle():
    call_service(
        "light",
        "toggle",
        {"entity_id": "light.dining_room_light"}
    )
    return redirect(f"{request.referrer or url_for('index')}")

@app.route("/downstairs_toggle", methods=['GET', 'POST'])
def downstairs_toggle():
    call_service(
        "script",
        "toggle_downstairs_lights",
        {}
    )
    return redirect(f"{request.referrer or url_for('index')}")
@app.route("/playpause")
def playpause():
    call_service("media_player", "media_play_pause", {"entity_id": "media_player.tv"})
    return redirect(f"{request.referrer or url_for('index')}")

@app.route("/living_room")
def index():
    return render_template("living_room.html")

# @app.route("/alien/medium")
# def index():
#     return render_template("alien/medium/index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
