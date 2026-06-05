(function () {
  "use strict";

  function track(eventName, params) {
    if (typeof gtag !== "function") return;
    gtag("event", eventName, params || {});
  }

  window.TierraAnalytics = { track: track };

  document.addEventListener("click", function (e) {
    var target = e.target.closest("a, button");
    if (!target) return;

    if (target.classList.contains("faq-question")) {
      if (target.getAttribute("aria-expanded") !== "true") {
        track("faq_open", {
          event_category: "engagement",
          event_label: target.textContent.replace(/\s+/g, " ").trim(),
          page_path: location.pathname,
        });
      }
      return;
    }

    if (target.closest(".site-nav") && target.tagName === "A") {
      track("nav_click", {
        event_category: "navigation",
        event_label: target.textContent.trim(),
        link_url: target.href,
        page_path: location.pathname,
      });
      return;
    }

    if (
      target.matches("a.btn") ||
      (target.matches("button.btn") && target.type !== "submit")
    ) {
      track("cta_click", {
        event_category: "engagement",
        event_label: (target.textContent || "").trim(),
        link_url: target.href || location.pathname,
        page_path: location.pathname,
      });
    }
  });

  var phoneInput = document.getElementById("phone");
  if (phoneInput) {
    var phoneTracked = false;
    phoneInput.addEventListener("input", function () {
      if (phoneTracked || phoneInput.value.replace(/\D/g, "").length < 10) return;
      phoneTracked = true;
      track("phone_completed", {
        event_category: "form",
        event_label: "contact_form",
        page_path: location.pathname,
      });
    });
  }

  var serviceSelect = document.getElementById("service");
  if (serviceSelect) {
    serviceSelect.addEventListener("change", function () {
      if (!serviceSelect.value) return;
      track("service_selected", {
        event_category: "form",
        event_label: serviceSelect.value,
        page_path: location.pathname,
      });
    });
  }
})();
