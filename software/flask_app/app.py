from flask import render_template
from flask_base import app
from ha_routes import *


@app.route("/living_room")
def index():
    return render_template("rooms/living_room.html")

@app.route("/office")
def office():
    return render_template(
        "rooms/office.html",
        modal_title="All Office Lights",
        modal_message="Are you sure you want to turn off all office lights?",
        modal_cancel_text="Cancel",
        modal_confirm_text="OK",
        modal_confirm_action="/office_lights_off"
    )

@app.route("/libbys_office")
def libbys_office():
    return render_template("rooms/libbys_office.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
