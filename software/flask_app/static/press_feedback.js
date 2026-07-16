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

    var modal = document.getElementById("all-lights-modal");
    var backdrop = document.getElementById("modal-backdrop");

    function showModal() {
      modal.style.top =
    (window.pageYOffset + (window.innerHeight - modal.offsetHeight) / 2 + 30) + "px";
      modal.style.display = "block";
      backdrop.style.display = "block";
    }

    function hideModal() {
      modal.style.display = "none";
      backdrop.style.display = "none";
    }

    var allLightsButton = document.getElementById("all-lights-button");
    if (allLightsButton) {
      allLightsButton.onclick = function () {
        showModal();
        return false;
      };
    }

    var cancelButton = document.getElementById("modal-cancel");
    if (cancelButton) {
      cancelButton.onclick = function () {
        hideModal();
        return false;
      };
    }

    var confirmButton = document.getElementById("modal-confirm");

    if (confirmButton) {
      confirmButton.onclick = function () {
        hideModal();

        window.setTimeout(function () {
          document.getElementById("all-lights-form").submit();
        }, 50);

        return false;
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
