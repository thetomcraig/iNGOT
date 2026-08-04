(function () {
  function refreshAfterAction() {
    var sink = document.querySelector('iframe[name="sink"]');
    var refreshPending = false;

    if (!sink) return;

    document.addEventListener("submit", function (event) {
      if (event.target.getAttribute("target") === "sink") {
        refreshPending = true;
      }
    });

    sink.addEventListener("load", function () {
      if (!refreshPending) return;

      refreshPending = false;
      window.location.reload();
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
