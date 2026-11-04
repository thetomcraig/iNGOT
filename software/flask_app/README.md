# Flask App for Home Assistant Integration

This is a Flask web application that provides a user interface for Home Assistant integration with various room layouts and controls.

## Project Structure

The project uses the standard `src` layout for Python packages:
- `src/flask_app/` - Main application code
- `src/flask_app/app.py` - Main Flask application entry point
- `src/flask_app/flask_base.py` - Base Flask configuration
- `src/flask_app/ha_routes.py` - Home Assistant API routes
- `src/flask_app/helpers.py` - Helper functions and environment configuration

## Installation

1. Install the dependencies using uv:
   ```bash
   uv pip install -e .
   ```

2. Create a `.env` file with the required environment variables:
   ```bash
   HA_URL=http://homeassistant.techdaddy.lol
   HA_TOKEN=your_home_assistant_token_here
   CHILD_1=eloise
   SPOUSE=libby
   ```

3. Run the application:
   ```bash
   uv run python -m src.flask_app.app
   ```

## Running with uv

You can also run the application directly with uv:
```bash
uv run python -m src.flask_app.app
```

## Available Routes

- `/office_960x640` - Office layout (960x640)
- `/bathroom_960x640` - Bathroom layout (960x640)
- `/guest_room_960x640` - Guest room layout (960x640)
- `/living_room_960x640` - Living room layout (960x640)
- `/office_1136x640` - Office layout (1136x640)
- `/spouse_office` - Spouse office layout

And various API endpoints for Home Assistant controls:
- `/vacuum_start`
- `/vacuum_stop`
- `/vacuum_toggle_pause`
- `/office_lights_off`
- `/3d_printer_toggle`
- `/set_message`
- `/ice_maker_toggle`
- `/living_room_toggle`
- `/dining_room_toggle`
- `/downstairs_toggle`
- `/playpause`
- `/office_fans_lights_toggle`
- `/office_ceiling_lights_toggle`
- `/office_lamps_toggle`
- `/spouse_office_lights_toggle`
- `/child_1_lamp_toggle`
- `/guest_room_lamp_toggle`

## Dependencies

The application requires:
- Flask (for web framework)
- requests (for API calls to Home Assistant and Open-Meteo)