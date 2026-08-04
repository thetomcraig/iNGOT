(function () {
  function refreshAfterAction() {
    var refreshScheduled = false;

    // All API action buttons submit their form to the hidden "sink" iframe.
    // Listening for submit covers every button created by api_call_button.
    document.addEventListener("submit", function (event) {
      if (event.target.getAttribute("target") !== "sink" || refreshScheduled) {
        return;
      }

      refreshScheduled = true;

      // Let the form POST begin before replacing the current page. The API
      // endpoints return 204 responses, which do not reliably trigger iframe
      // load events across browsers.
      window.setTimeout(function () {
        window.location.reload();
      }, 180);
    });
  }

  if (window.addEventListener) {
    window.addEventListener("load", refreshAfterAction, false);
  } else if (window.attachEvent) {
    window.attachEvent("onload", refreshAfterAction);
  } else {
    window.onload = refreshAfterAction;
  }
}());
