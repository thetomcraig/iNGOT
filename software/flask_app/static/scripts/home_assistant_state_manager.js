(function () {
  // Map each Home Assistant entity to the elements that visually represent it.
  var stateElementMap = {
    "switch.3d_printer": ".three-d-printer",
    "switch.office_lamp": ".office-lamp",
    "switch.libby_s_office_lamp": ".libby-s-office-lamp",
    "switch.eloise_s_lamp": ".eloise-s-lamp",
    "light.office_ceiling_light_north": ".office-ceiling-lights",
    "light.office_fan_light_west": ".office-fan-lights",
    "switch.living_room_light": ".living-room-light",
    "light.dining_room_light": ".dining-room-light",
  };

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

  function applyHomeAssistantStates(homeAssistantStates) {
    var entityId;

    // iOS 3 predates Object.keys and element.classList.
    for (entityId in stateElementMap) {
      if (!stateElementMap.hasOwnProperty(entityId)) {
        continue;
      }

      var entityState = homeAssistantStates[entityId];
      var isOn = entityState && entityState.state === "on";
      var elements = document.querySelectorAll(stateElementMap[entityId]);

      for (var i = 0; i < elements.length; i += 1) {
        if (isOn) {
          addClass(elements[i], "is-on");
        } else {
          removeClass(elements[i], "is-on");
        }
      }
    }
  }

  window.applyHomeAssistantStates = applyHomeAssistantStates;
  applyHomeAssistantStates(window.homeAssistantStates || {});
}());
