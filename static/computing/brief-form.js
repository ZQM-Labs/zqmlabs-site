// Send a GIS project brief to POST /api/inquiries. No analytics.
// Client-side validation mirrors the PocketBase inquiry hook's field bounds;
// the hook is authoritative. A 201 response must include a reference.
// Mailto stays as the fallback: on any failure the page's email links are
// right below the form.
document.addEventListener("DOMContentLoaded", function () {
  var ENDPOINT = "https://api.zqmlabs.com/api/inquiries";
  var SERVICE_TYPES = ["generic", "map-production", "workflow", "web-gis"];
  var TEMPLATE_TO_SERVICE = {
    "brief-generic": "generic",
    "brief-map-production": "map-production",
    "brief-workflow": "workflow",
    "brief-web-gis": "web-gis"
  };
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var SEND_FAILED = "Could not send your brief right now — please email it instead.";

  var form = document.getElementById("brief-form");
  if (!form) return;
  var nameInput = document.getElementById("brief-name");
  var emailInput = document.getElementById("brief-email");
  var orgInput = document.getElementById("brief-organisation");
  var serviceSelect = document.getElementById("brief-service-type");
  var briefInput = document.getElementById("brief-text");
  var websiteInput = document.getElementById("brief-website");
  var statusEl = document.getElementById("brief-form-status");
  var submitBtn = form.querySelector('button[type="submit"]');

  function setStatus(text, isError) {
    statusEl.textContent = text;
    statusEl.className = isError ? "brief-error" : "brief-success";
  }

  // Clicking a template's copy button also selects that service and, when
  // the brief box is still empty, fills it with the template's fields.
  // This runs alongside copy-brief.js; it does not interfere with the copy.
  document.querySelectorAll("button[data-copy-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-copy-target");
      var service = TEMPLATE_TO_SERVICE[target];
      if (service) serviceSelect.value = service;
      if (!briefInput.value.trim()) {
        var el = document.getElementById(target);
        if (el) briefInput.value = el.innerText;
      }
    });
  });

  // Same rules and messages as POST /api/inquiries in pb_hooks/main.pb.js.
  function validate() {
    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var org = orgInput.value.trim();
    var service = serviceSelect.value;
    var brief = briefInput.value.trim();
    if (!name || name.length > 120) return "name is required (max 120 characters)";
    if (!email || email.length > 254 || !EMAIL_RE.test(email)) return "a valid email is required";
    if (org.length > 200) return "organisation must be at most 200 characters";
    if (SERVICE_TYPES.indexOf(service) === -1) return "brief_type must be one of: " + SERVICE_TYPES.join(", ");
    if (!brief || brief.length > 20000) return "brief_text is required (max 20000 characters)";
    return null;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var error = validate();
    if (error) { setStatus(error, true); return; }
    var payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      organisation: orgInput.value.trim(),
      brief_type: serviceSelect.value,
      brief_text: briefInput.value.trim(),
      source: "form",
      website: websiteInput ? websiteInput.value : ""
    };
    submitBtn.disabled = true;
    setStatus("Sending your brief…", false);
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (resp) {
      // A generic HTTP 2xx response is not proof the inquiry was stored.
      // The PocketBase hook returns 201 with an acknowledgement reference.
      return resp.json().then(function (data) {
        if (resp.status === 201 && data && data.ok === true &&
            typeof data.reference === "string" && data.reference.length > 0) {
          return { ok: true };
        }
        return { ok: false, error: (data && typeof data.error === "string" && data.error) || SEND_FAILED };
      }).catch(function () {
        return { ok: false, error: SEND_FAILED };
      });
    }).then(function (result) {
      if (result.ok) {
        form.reset();
        setStatus("Thank you — your brief has been submitted. Please retain a copy of your project details for your records.", false);
      } else {
        setStatus(result.error, true);
      }
    }).catch(function () {
      setStatus(SEND_FAILED, true);
    }).finally(function () {
      submitBtn.disabled = false;
    });
  });
});
