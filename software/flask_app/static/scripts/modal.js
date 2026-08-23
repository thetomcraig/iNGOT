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

    // Set up modal buttons
    for (i = 0; i < buttons.length; i++) {
      var button = buttons[i];

      // Set up modal open button
      if (button.getAttribute("data-modal-open") !== null) {
        button.onclick = function(e) {
          e.preventDefault();
          showModal(this.getAttribute("data-modal-open"));
          return false;
        };
      }

      // Handle close button
      if (button.getAttribute("data-modal-close") !== null && !button._handledClose) {
        button._handledClose = true;
        button.addEventListener("click", function(e) {
          e.preventDefault();
          hideModal();
          return false;
        });
      }
    }

    // Handle form submissions in modals
    for (i = 0; i < forms.length; i++) {
      if (forms[i].getAttribute("data-modal-form") !== null) {
        forms[i].onsubmit = function () {
          hideModal();
        };
      }
    }

    backdrop.onclick = hideModal;
  }

  // Run it at load
  if (window.addEventListener) {
    window.addEventListener("load", attachModals, false);
  } else if (window.attachEvent) {
    window.attachEvent("onload", attachModals);
  } else {
    window.onload = attachModals;
  }
}());
