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
   * Synchronize all stateful icons with a Home Assistant state collection.
   *
   * @param {Object} homeAssistantStates States indexed by entity ID.
   */
  function applyHomeAssistantStates(homeAssistantStates) {
    var images = document.getElementsByTagName("img");
    var updatedEntities = {};
    var i;

    for (i = 0; i < images.length; i += 1) {
      var entityId = entityIdForElement(images[i]);
      if (!entityId || updatedEntities[entityId]) {
        continue;
      }

      updatedEntities[entityId] = true;
      var entityState = homeAssistantStates[entityId];
      setEntityOn(entityId, entityState && entityState.state === "on");
    }
  }

  /**
   * Optimistically toggle every stateful icon contained by a submitted form.
   *
   * @param {HTMLFormElement} form Form whose API action was submitted.
   */
  function toggleStateForForm(form) {
    var images = form.getElementsByTagName("img");
    var toggledEntities = {};
    var i;

    for (i = 0; i < images.length; i += 1) {
      var entityId = entityIdForElement(images[i]);
      if (!entityId || toggledEntities[entityId]) {
        continue;
      }

      toggledEntities[entityId] = true;
      var entityState = window.homeAssistantStates[entityId] || {};
      entityState.state = entityState.state === "on" ? "off" : "on";
      window.homeAssistantStates[entityId] = entityState;
    }

    // Update every representation of an entity, not just the icon pressed.
    applyHomeAssistantStates(window.homeAssistantStates);
  }

  /**
   * Listen for API form submissions and update their icons immediately.
   */
  function attachOptimisticStateToggles() {
    var forms = document.getElementsByTagName("form");
    var i;

    for (i = 0; i < forms.length; i += 1) {
      if (forms[i].addEventListener) {
        forms[i].addEventListener("submit", function () {
          toggleStateForForm(this);
        }, false);
      }
    }
  }

  window.applyHomeAssistantStates = applyHomeAssistantStates;
  window.homeAssistantStates = window.homeAssistantStates || {};
  applyHomeAssistantStates(window.homeAssistantStates);
  attachOptimisticStateToggles();
}());
