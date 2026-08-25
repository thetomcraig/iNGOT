(function () {

  function hasClass(element, className) {
    return new RegExp("(^|\\s)" + className + "(?:\\s|$)").test(element.className);
  }

  function addClass(element, className) {
    if (!hasClass(element, className)) {
      element.className += (element.className ? " " : "") + className;
    }
  }

  function removeClass(element, className) {
    var classPattern = new RegExp("(^|\\s+)" + className + "(?=\\s|$)", "g");
    element.className = element.className.replace(classPattern, " ").replace(/^\\s+|\\s+$/g, "");
  }

  /**
   * Read the Home Assistant entity associated with an icon.
   *
   * @param {Element} element Icon element to inspect.
   * @returns {string|null} Associated entity ID, if any.
   */
  function entityIdForElement(element) {
    return element.getAttribute("data-ha-entity");
  }

  /**
   * Set the visual on/off state for every icon representing an entity.
   *
   * @param {string} entityId Home Assistant entity ID.
   * @param {boolean} isOn Whether the entity is on.
   */
  function setEntityOn(entityId, isOn) {
    var images = document.getElementsByTagName("img");
    var i;

    for (i = 0; i < images.length; i += 1) {
      if (entityIdForElement(images[i]) !== entityId) {
        continue;
      }

      if (isOn) {
        addClass(images[i], "is-on");
      } else {
        removeClass(images[i], "is-on");
      }
    }
  }

  /**
   * Render the state of an entity into every span marked for state text.
   *
   * @param {string} entityId Home Assistant entity ID.
   * @param {string} state The Home Assistant state to display.
   */
  function setEntityText(entityId, state) {
    var spans = document.getElementsByTagName("span");
    var i;

    for (i = 0; i < spans.length; i += 1) {
      if (
        entityIdForElement(spans[i]) === entityId &&
        spans[i].getAttribute("data-ha-state-text") !== null
      ) {
        spans[i].textContent = state;
      }
    }
  }

  /**
   * Fetch weather data from Open-Meteo API and update the temperature display.
   */
  function fetchWeatherData() {
    // Coordinates for Los Angeles (example values)
    const latitude = 34.17;
    const longitude = -118.26;
    
    // Construct the API URL with parameters
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&hourly=temperature_2m,precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&temperature_unit=fahrenheit&timezone=auto`;

    // Fetch weather data
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data && data.current && data.current.temperature_2m !== undefined) {
          // Get the current temperature
          const currentTemp = data.current.temperature_2m;
          
          // Find all elements with class outside-temp-number and update them with the temperature
          const tempElements = document.querySelectorAll('.outside-temp-number');
          tempElements.forEach(element => {
            element.textContent = Math.round(currentTemp);
          });
        }
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  }

  /**
   * Synchronize all stateful icons with a Home Assistant state collection.
   *
   * @param {Object} homeAssistantStates States indexed by entity ID.
   */
  function applyHomeAssistantStates(homeAssistantStates) {
    var images = document.getElementsByTagName("img");
    var spans = document.getElementsByTagName("span");
    var updatedEntities = {};
    var i;
    var entityId;
    var entityState;

    for (i = 0; i < images.length; i += 1) {
      entityId = entityIdForElement(images[i]);
      if (!entityId || updatedEntities[entityId]) {
        continue;
      }
      updatedEntities[entityId] = true;
      entityState = homeAssistantStates[entityId];
      setEntityOn(entityId, entityState && entityState.state === "on");
    }

    for (i = 0; i < spans.length; i += 1) {
      entityId = entityIdForElement(spans[i]);
      if (!entityId || spans[i].getAttribute("data-ha-state-text") === null) {
        continue;
      }
      entityState = homeAssistantStates[entityId];
      setEntityText(entityId, entityState ? entityState.state : "");
    }
  }

  function toggleEntityForForm(form) {
    var images = form.getElementsByTagName("img");
    var entityId;
    var isOn = false;
    var i;

    // Only image buttons have an optimistic on/off state. A text-input
    // modal may also carry data-ha-entity, but it must not affect borders.
    if (!images.length) {
      return;
    }

    entityId = entityIdForElement(images[0]);
    if (!entityId) {
      return;
    }

    for (i = 0; i < images.length; i += 1) {
      if (entityIdForElement(images[i]) === entityId) {
        isOn = hasClass(images[i], "is-on");
        break;
      }
    }

    setEntityOn(entityId, !isOn);
  }

  function updateTextSpanForForm(form) {
    var inputs = form.getElementsByTagName("input");
    var textInput = null;
    var entityInput = null;
    var spans;
    var i;

    for (i = 0; i < inputs.length; i += 1) {
      if (inputs[i].getAttribute("type") === "text") {
        textInput = inputs[i];
      }
      if (inputs[i].getAttribute("name") === "entity_id") {
        entityInput = inputs[i];
      }
    }

    if (!textInput || !entityInput || textInput.value === "") {
      return false;
    }

    spans = document.getElementsByTagName("span");
    for (i = 0; i < spans.length; i += 1) {
      if (
        entityIdForElement(spans[i]) === entityInput.value &&
        spans[i].getAttribute("data-ha-state-text") !== null
      ) {
        spans[i].textContent = textInput.value;
      }
    }

    return true;
  }

  function attachButtonBehaviors() {
    var forms = document.getElementsByTagName("form");
    var i;

    for (i = 0; i < forms.length; i += 1) {
      if (forms[i].addEventListener) {
        forms[i].addEventListener("submit", function () {
          var form = this;

          if (form.getAttribute("data-ha-refresh") !== null) {
            window.setTimeout(function () {
              window.location.reload();
            }, 750);
            return;
          }

          if (updateTextSpanForForm(form)) {
            return;
          }

          toggleEntityForForm(form);
        }, false);
      }
    }
  }

  // Fetch weather data when the page loads
  window.addEventListener('load', function() {
    fetchWeatherData();
    
    // Set up periodic updates (every 10 minutes)
    setInterval(fetchWeatherData, 10 * 60 * 1000);
  });

  window.applyHomeAssistantStates = applyHomeAssistantStates;
  window.homeAssistantStates = window.homeAssistantStates || {};
  applyHomeAssistantStates(window.homeAssistantStates);
  attachButtonBehaviors();
}());
