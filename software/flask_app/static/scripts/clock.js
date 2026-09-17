(function () {
  // Function to update the clock
  console.log("funcion");
  function updateClock() {
    let now = new Date();

    // Extract time values
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // AM/PM format
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 24hr → 12hr format

    // Add leading zeros
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');

    // Format time
    let timeStr = `${hours}:${minutes}:${seconds} ${ampm}`;

    // Format date
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let dateStr = now.toLocaleDateString(undefined, options);

    // Display in HTML
    document.getElementById("clock").innerText = timeStr;
    document.getElementById("date").innerText = dateStr;
  }

    // Run it at load
  if (window.addEventListener) {
    window.addEventListener("load", updateClock, false);
  } else if (window.attachEvent) {
    window.attachEvent("onload", updateClock);
  } else {
    window.onload = updateClock;
  }

  window.setTimeout(function () {
    window.location.reload();
    updateClock();
  }, 1000);
}());