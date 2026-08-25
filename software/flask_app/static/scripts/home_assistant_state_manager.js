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
    var entityId = form.getAttribute("data-ha-entity");
    var isOn = false;
    var i;

    if (!entityId && images.length) {
      entityId = entityIdForElement(images[0]);
    }
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

          toggleEntityForForm(form);
        }, false);
      }
    }
  }

  window.applyHomeAssistantStates = applyHomeAssistantStates;
  window.homeAssistantStates = window.homeAssistantStates || {};
  applyHomeAssistantStates(window.homeAssistantStates);
  attachButtonBehaviors();
}());
