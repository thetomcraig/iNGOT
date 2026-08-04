(function () {
  // Map each Home Assistant entity to the elements that visually represent it.
  var stateElementMap = {
    "switch.3d_printer": ".three-d-printer",
    "switch.office_lamp": ".office-lamp"
  };

  function applyHomeAssistantStates(homeAssistantStates) {
    Object.keys(stateElementMap).forEach(function (entityId) {
      var entityState = homeAssistantStates[entityId];
      var isOn = entityState && entityState.state === "on";
      var elements = document.querySelectorAll(stateElementMap[entityId]);

      elements.forEach(function (element) {
        element.classList.toggle("is-on", isOn);
      });
    });
  }

  window.applyHomeAssistantStates = applyHomeAssistantStates;
  applyHomeAssistantStates(window.homeAssistantStates || {});
}());
