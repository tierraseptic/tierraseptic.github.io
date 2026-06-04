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

  var form = document.getElementById("contact-form");
  if (form) {
    var submitBtn = form.querySelector('[type="submit"]');
    var defaultBtnText = submitBtn ? submitBtn.textContent : "Submit request";

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var status = document.getElementById("form-status");
      if (!status) return;

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
