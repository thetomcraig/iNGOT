(function () {
  function updateDate() {
    var now = new Date();
    
    // Get month name
    var months = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];
    var month = months[now.getMonth()];
    
    // Get day with ordinal suffix
    var day = now.getDate();
    var daySuffix;
    if (day > 3 && day < 21) {
      daySuffix = 'th';
    } else {
      switch (day % 10) {
        case 1: 
          daySuffix = "st";
          break;
        case 2:
          daySuffix = "nd";
          break;
        case 3:
          daySuffix = "rd";
          break;
        default:
          daySuffix = "th";
      }
    }
    
    
    // Format the date string as "January 1st, 2027"
    var dateString = month + " " + day + daySuffix;
    
    var dateElement = document.getElementById("date");
    if (dateElement) {
      // Check if it's an iOS version that supports innerText
      if (typeof dateElement.innerText !== 'undefined') {
        dateElement.innerText = dateString;
      } else {
        // Fallback for very old browsers
        dateElement.textContent = dateString;
      }
    }
  }

  // Update immediately when page loads or as soon as DOM is ready
  if (document.readyState === "complete" || document.readyState === "loaded") {
    updateDate();
  } else {
    window.addEventListener("load", updateDate);
  }
}());