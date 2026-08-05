(function () {
  function setupWeather() {
  var tempTiles = [
    {
      number: document.getElementById("eloises-temp-number"),
      url: "/eloises_temp"
    },
    {
      number: document.getElementById("outside-temp-number"),
      url: "/outside_temp"
    }
  ];

  var refreshIntervalMs = 1 * 60 * 1000;
  var tempRequests = {};

  function refreshTemp(tile) {
    var tempRequest = tempRequests[tile.url];

    if (tempRequest && tempRequest.readyState !== 4) {
      return;
    }

    tempRequest = new XMLHttpRequest();
    tempRequests[tile.url] = tempRequest;
    tempRequest.onreadystatechange = function () {
      if (tempRequest.readyState === 4 && tempRequest.status === 200) {
        tile.number.textContent = tempRequest.responseText.replace("°", "").replace(/^\s+|\s+$/g, "");
      }
    };
    tempRequest.open("GET", tile.url + "?t=" + new Date().getTime(), true);
    tempRequest.send();
  }

function refreshTemps() {
  var i;
  for (i = 0; i < tempTiles.length; i++) {
    if (tempTiles[i].number) {
      refreshTemp(tempTiles[i]);
    }
  }
}

  refreshTemps();
  window.setInterval(refreshTemps, refreshIntervalMs);

  var refreshPage = document.getElementById("refresh-page");
  if (refreshPage) {
    refreshPage.addEventListener("click", function () {
      window.setTimeout(function () {
        window.location.reload();
      }, 180);
    });
  }
}


  if (window.addEventListener) {
    window.addEventListener("load", setupWeather, false);
  } else if (window.attachEvent) {
    window.attachEvent("onload", setupWeather);
  } else {
    window.onload = setupWeather;
  }

})();
