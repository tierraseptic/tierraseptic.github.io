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

  var params = new URLSearchParams(window.location.search);
  if (params.get("submitted") === "true") {
    var status = document.getElementById("form-status");
    if (status) {
      status.textContent =
        "Thank you. Your request was submitted successfully. We will be in touch soon.";
      status.className = "form-status success";
    }
  }

  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      var status = document.getElementById("form-status");
      if (!status) return;
      status.className = "form-status";
      status.style.display = "none";
      status.textContent = "";
    });
  }
})();
