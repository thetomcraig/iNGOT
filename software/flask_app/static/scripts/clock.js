(function () {
  function updateClock() {
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    hours = hours % 12 || 12;
    minutes = minutes.toString().padStart(2, '0');
    let timeStr = `${hours}:${minutes}`;
    document.getElementById("clock").innerText = timeStr;
  }

  // Run it at load
  if (window.addEventListener) {
    window.addEventListener("load", updateClock, false);
  } else if (window.attachEvent) {
    window.attachEvent("onload", updateClock);
  } else {
    window.onload = updateClock;
  }

  setInterval(updateClock, 30000);
}());