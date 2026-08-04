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
      backdrop.style.display = "block";
    }

    for (i = 0; i < buttons.length; i++) {
      if (buttons[i].getAttribute("data-modal-open")) {
        buttons[i].onclick = function () {
          showModal(this.getAttribute("data-modal-open"));
          return false;
        };
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
          window.setTimeout(function () {
            window.location.reload();
          }, 180);
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
