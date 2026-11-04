(function () {
  function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();

    // Handle padding for older browsers that don't support padStart
    if (typeof minutes.toString().padStart === 'function') {
      minutes = minutes.toString().padStart(2, '0');
    } else {
      minutes = (minutes < 10 ? '0' : '') + minutes;
    }
    
    hours = hours % 12 || 12;
    var timeStr = hours + ':' + minutes;
    
    var clockElement = document.getElementById("clock");
    if (clockElement) {
      // Check if it's an iOS version that supports innerText
      if (typeof clockElement.innerText !== 'undefined') {
        clockElement.innerText = timeStr;
      } else {
        // Fallback for very old browsers
        clockElement.textContent = timeStr;
      }
    }
  }

  // Run it at load with multiple fallbacks for older iOS
  var ready = false;
  
  // Try modern approach first
  if (typeof window.addEventListener !== 'undefined') {
    window.addEventListener("load", function() {
      updateClock();
      ready = true;
    }, false);
  } 
  // Try attachEvent for older IE
  else if (typeof window.attachEvent !== 'undefined') {
    window.attachEvent("onload", function() {
      updateClock();
      ready = true;
    });
  } 
  // Fallback to onload property
  else {
    window.onload = function() {
      updateClock();
      ready = true;
    };
  }
  
  // Set interval for updating clock
  setInterval(updateClock, 30000);
  
  // Force update immediately if page is already loaded
  setTimeout(function() {
    if (!ready) {
      updateClock();
    }
  }, 100);
  
  // Also try to run immediately if DOM is ready
  if (document.readyState === "complete" || document.readyState === "loaded") {
    setTimeout(updateClock, 10);
  }
}());