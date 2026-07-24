from flask import render_template
from flask_base import app
from ha_routes import *


@app.route("/living_room_1136x640")
def living_room_1136x640():
    return render_template("rooms/living_room_1136x640.html")

@app.route("/living_room_960x640")
def living_room_960x640():
    return render_template("rooms/living_room_960x640.html")

@app.route("/office")
def office():
    return render_template(
        "rooms/office.html",
        modal_title="3D Printer",
        modal_message="Toggle the printer?",
        modal_cancel_text="Cancel",
        modal_confirm_text="OK",
        modal_confirm_action="/3d_printer_toggle"
    )

@app.route("/office_1136x640")
def office_1136x640():
    return render_template("rooms/office_1136x640.html",
        modal_title="3D Printer",
        modal_message="Toggle the printer?",
        modal_cancel_text="Cancel",
        modal_confirm_text="OK",
        modal_confirm_action="/3d_printer_toggle"
    )

@app.route("/libbys_office")
def libbys_office():
    return render_template("rooms/libbys_office.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
