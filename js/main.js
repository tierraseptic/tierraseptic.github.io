(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  document.querySelectorAll(".faq-question").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var answer = btn.nextElementSibling;
      var expanded = btn.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".faq-item").forEach(function (el) {
        el.removeAttribute("open");
        var q = el.querySelector(".faq-question");
        var a = el.querySelector(".faq-answer");
        if (q) q.setAttribute("aria-expanded", "false");
        if (a) a.hidden = true;
      });
      if (!expanded && answer) {
        item.setAttribute("open", "");
        btn.setAttribute("aria-expanded", "true");
        answer.hidden = false;
      }
    });
  });

  function formatPhoneNumber(value) {
    var digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length === 0) return "";
    if (digits.length < 4) return "(" + digits;
    if (digits.length < 7) {
      return "(" + digits.slice(0, 3) + ") " + digits.slice(3);
    }
    return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);
  }

  function setPhoneCursor(input, digitsBeforeCursor) {
    var pos = 0;
    var count = 0;
    for (var i = 0; i < input.value.length; i++) {
      if (/\d/.test(input.value.charAt(i))) {
        count++;
      }
      pos = i + 1;
      if (count >= digitsBeforeCursor) break;
    }
    input.setSelectionRange(pos, pos);
  }

  var phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      var end = phoneInput.selectionEnd || 0;
      var digitsBefore = phoneInput.value.slice(0, end).replace(/\D/g, "").length;
      phoneInput.value = formatPhoneNumber(phoneInput.value);
      setPhoneCursor(phoneInput, digitsBefore);
      phoneInput.setCustomValidity("");
    });

    phoneInput.addEventListener("blur", function () {
      var digits = phoneInput.value.replace(/\D/g, "");
      if (digits.length > 0 && digits.length < 10) {
        phoneInput.setCustomValidity("Please enter a 10-digit phone number.");
      } else {
        phoneInput.setCustomValidity("");
      }
    });
  }

  var form = document.getElementById("contact-form");
  if (form) {
    var submitBtn = form.querySelector('[type="submit"]');
    var defaultBtnText = submitBtn ? submitBtn.textContent : "Submit request";

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var status = document.getElementById("form-status");
      if (!status) return;

      if (phoneInput) {
        var phoneDigits = phoneInput.value.replace(/\D/g, "");
        if (phoneDigits.length < 10) {
          phoneInput.setCustomValidity("Please enter a 10-digit phone number.");
          phoneInput.reportValidity();
          return;
        }
        phoneInput.setCustomValidity("");
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      status.className = "form-status";
      status.textContent = "";

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (!response.ok) {
            return response.json().then(function (data) {
              throw new Error(data.error || "Something went wrong. Please try again.");
            });
          }
          return response.json();
        })
        .then(function () {
          status.textContent =
            "Thank you. Your request was submitted successfully. We will be in touch soon.";
          status.className = "form-status success";
          form.reset();
          status.scrollIntoView({ behavior: "smooth", block: "nearest" });
        })
        .catch(function (err) {
          status.textContent =
            err.message || "Unable to send your request. Please try again or call us directly.";
          status.className = "form-status error";
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = defaultBtnText;
          }
        });
    });
  }
})();
