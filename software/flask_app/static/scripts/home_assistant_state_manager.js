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

    console.log("Applying Home Assistant states, ALL states:")
    console.log(homeAssistantStates);
    console.log("searching images");
    console.log(images);
    for (i = 0; i < images.length; i += 1) {
      entityId = entityIdForElement(images[i]);
      if (!entityId || updatedEntities[entityId]) {
        continue;
      }
      updatedEntities[entityId] = true;
      entityState = homeAssistantStates[entityId];
      console.log("set on/off for " + entityId);
      setEntityOn(entityId, entityState && entityState.state === "on");
    }

    console.log("searching spans");
    for (i = 0; i < spans.length; i += 1) {
      entityId = entityIdForElement(spans[i]);
      if (!entityId || spans[i].getAttribute("data-ha-state-text") === null) {
        continue;
      }
      console.log("set text for " + entityId);
      entityState = homeAssistantStates[entityId];
      setEntityText(entityId, entityState ? entityState.state : "");
    }
  }

  function logEntityState(entityId, button) {
    var request = new XMLHttpRequest();
    console.log("calling flask 'ha_state' endpoint for " + entityId);
    var url = "/ha_state/" + encodeURIComponent(entityId) + "?debug=" + new Date().getTime();

    request.open("GET", url, true);
    request.onreadystatechange = function () {
      if (request.readyState !== 4) {
        return;
      }
      console.log("Home Assistant response for " + entityId + ":");
      console.log(request.status);
      console.log(request.responseText);
      if (request.status >= 200 && request.status < 300) {
        var state = JSON.parse(request.responseText);
        window.homeAssistantStates[entityId] = state;
        applyHomeAssistantStates(window.homeAssistantStates);
        reloadButton(button);
      }
    };
    request.send(null);
  }

  function reloadButton(button) {
    if (button && button.parentNode) {
      button.parentNode.replaceChild(button.cloneNode(true), button);
      if (window.attachPressFeedback) {
        window.attachPressFeedback();
      }
    }
  }

  function attachStateQueries() {
    console.log("attaching state queries");
    var forms = document.getElementsByTagName("form");
    var i;

    console.log("found forms");
    console.log(forms);
    for (i = 0; i < forms.length; i += 1) {
      if (forms[i].addEventListener) {
        forms[i].addEventListener("submit", function () {
          var images = this.getElementsByTagName("img");
          var entityId = this.getAttribute("data-ha-entity");
          var buttons = this.getElementsByTagName("button");
          var button = buttons.length ? buttons[0] : null;

          if (!entityId && images.length) {
            entityId = entityIdForElement(images[0]);
          }
          if (entityId) {
            // The form action and this listener run in parallel. Give HA time
            // to apply the service call before reading the entity state.
            window.setTimeout(function () {
              logEntityState(entityId, button);
            }, 500);
          }
        }, false);
      }
    }
  }

  window.applyHomeAssistantStates = applyHomeAssistantStates;
  window.homeAssistantStates = window.homeAssistantStates || {};
  applyHomeAssistantStates(window.homeAssistantStates);
  attachStateQueries();
}());
