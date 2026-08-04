(function () {
  // Map each Home Assistant entity to the elements that visually represent it.
  var stateElementMap = {
    "switch.3d_printer": ".three-d-printer",
    "switch.office_lamp": ".office-lamp",
    "light.office_ceiling_light_north": ".office-ceiling-lights",
    "light.office_fan_light_west": ".office-fan-lights",
    "switch.eloise_s_lamp": ".eloise-s-lamp",
  };

  function applyHomeAssistantStates(homeAssistantStates) {
    Object.keys(stateElementMap).forEach(function (entityId) {
      var entityState = homeAssistantStates[entityId];
      var isOn = entityState && entityState.state === "on";
      var elements = document.querySelectorAll(stateElementMap[entityId]);

      // iOS 8 lacks NodeList.forEach and classList.toggle's force argument.
      for (var i = 0; i < elements.length; i += 1) {
        if (isOn) {
          elements[i].classList.add("is-on");
        } else {
          elements[i].classList.remove("is-on");
        }
      }
    });
  }

  window.applyHomeAssistantStates = applyHomeAssistantStates;
  applyHomeAssistantStates(window.homeAssistantStates || {});
}());
