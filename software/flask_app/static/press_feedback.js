(function () {
  function clearPress(el) {
    if (!el) return;
    el.style.top = "0px";
    el.style.opacity = "1";
  }

  function press(el) {
    if (!el) return;
    el.style.position = "relative";
    el.style.top = "3px";
    el.style.opacity = "0.55";

    if (el._pressTimer) {
      window.clearTimeout(el._pressTimer);
    }

    el._pressTimer = window.setTimeout(function () {
      clearPress(el);
    }, 180);
  }

  function attachPressFeedback() {
    var buttons = document.getElementsByTagName("button");
    var i;

    for (i = 0; i < buttons.length; i++) {
      if ((" " + buttons[i].className + " ").indexOf(" image-button ") === -1) {
        continue;
      }

      buttons[i].ontouchstart = function () {
        press(this);
      };
      buttons[i].ontouchend = function () {
        clearPress(this);
      };
      buttons[i].ontouchcancel = function () {
        clearPress(this);
      };
      buttons[i].onmousedown = function () {
        press(this);
      };
      buttons[i].onmouseup = function () {
        clearPress(this);
      };
      buttons[i].onmouseout = function () {
        clearPress(this);
      };
    }
  }

  if (window.addEventListener) {
    window.addEventListener("load", attachPressFeedback, false);
  } else if (window.attachEvent) {
    window.attachEvent("onload", attachPressFeedback);
  } else {
    window.onload = attachPressFeedback;
  }
}());
