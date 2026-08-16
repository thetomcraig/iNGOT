(function () {
  function attachModals() {
    var backdrop = document.getElementById("modal-backdrop");
    var activeModal = null;
    var buttons = document.getElementsByTagName("button");
    var forms = document.getElementsByTagName("form");
    var i;

    function hideModal() {
      if (activeModal) {
        activeModal.style.display = "none";
        activeModal = null;
      }
      backdrop.style.display = "none";
    }

    function showModal(id) {
      var modal = document.getElementById(id);
      if (!modal) return;

      activeModal = modal;
      modal.style.top = (window.navigator.standalone ? 150 : 135) + "px";
      modal.style.display = "block";
      var input = modal.querySelector("input[autofocus]");
      if (input) input.focus();
      backdrop.style.display = "block";
    }

    function clearHold(button) {
      if (button._holdTimer) {
        window.clearTimeout(button._holdTimer);
        button._holdTimer = null;
      }
    }

    function startHold(button) {
      clearHold(button);
      button._holdTimer = window.setTimeout(function () {
        button._holdTimer = null;
        showModal(button.getAttribute("data-modal-open-hold"));
      }, 2000);
    }

    for (i = 0; i < buttons.length; i++) {
      if (buttons[i].getAttribute("data-modal-open")) {
        buttons[i].onclick = function () {
          showModal(this.getAttribute("data-modal-open"));
          return false;
        };
      }

      if (buttons[i].getAttribute("data-modal-open-hold")) {
        buttons[i].addEventListener("touchstart", function () {
          this._holdTouch = true;
          startHold(this);
        }, false);
        buttons[i].addEventListener("touchend", function () {
          clearHold(this);
          var button = this;
          window.setTimeout(function () {
            button._holdTouch = false;
          }, 500);
        }, false);
        buttons[i].addEventListener("touchcancel", function () {
          clearHold(this);
          this._holdTouch = false;
        }, false);
        buttons[i].addEventListener("mousedown", function () {
          if (!this._holdTouch) startHold(this);
        }, false);
        buttons[i].addEventListener("mouseup", function () {
          clearHold(this);
        }, false);
        buttons[i].addEventListener("mouseleave", function () {
          clearHold(this);
        }, false);
        buttons[i].addEventListener("click", function (event) {
          clearHold(this);
          event.preventDefault();
        }, false);
      }

      if (buttons[i].getAttribute("data-modal-close") !== null) {
        buttons[i].onclick = function () {
          hideModal();
          return false;
        };
      }
    }

    for (i = 0; i < forms.length; i++) {
      if (forms[i].getAttribute("data-modal-form") !== null) {
        forms[i].onsubmit = function () {
          hideModal();
        };
      }
    }

    backdrop.onclick = hideModal;
  }

  if (window.addEventListener) {
    window.addEventListener("load", attachModals, false);
  } else if (window.attachEvent) {
    window.attachEvent("onload", attachModals);
  } else {
    window.onload = attachModals;
  }
}());
