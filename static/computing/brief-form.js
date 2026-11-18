// Send a GIS project brief to POST /api/lantern/brief. No analytics.
// Client-side validation mirrors the hook's rules and error messages;
// the hook itself is the authority and its 400 message is shown on failure.
// Mailto stays as the fallback: on any failure the page's email links are
// right below the form.
document.addEventListener("DOMContentLoaded", function () {
  var ENDPOINT = "https://api.zqmlabs.com/api/lantern/brief";
  var SERVICE_TYPES = ["general", "map-production", "workflow-automation", "web-gis", "other"];
  var TEMPLATE_TO_SERVICE = {
    "brief-generic": "general",
    "brief-map-production": "map-production",
    "brief-workflow": "workflow-automation",
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

  // Same rules and messages as POST /api/lantern/brief in pb_hooks/main.pb.js.
  function validate() {
    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var org = orgInput.value.trim();
    var service = serviceSelect.value;
    var brief = briefInput.value.trim();
    if (!name || name.length > 120) return "name is required (max 120 characters)";
    if (!email || email.length > 254 || !EMAIL_RE.test(email)) return "a valid email is required";
    if (org.length > 120) return "organisation must be at most 120 characters";
    if (SERVICE_TYPES.indexOf(service) === -1) return "service_type must be one of: " + SERVICE_TYPES.join(", ");
    if (!brief || brief.length > 10000) return "brief_text is required (max 10000 characters)";
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
      service_type: serviceSelect.value,
      brief_text: briefInput.value.trim()
    };
    submitBtn.disabled = true;
    setStatus("Sending your brief…", false);
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (resp) {
      if (resp.ok) return { ok: true };
      return resp.json().then(function (data) {
        return { ok: false, error: (data && data.error) || SEND_FAILED };
      }).catch(function () {
        return { ok: false, error: SEND_FAILED };
      });
    }).then(function (result) {
      if (result.ok) {
        form.reset();
        setStatus("Thank you — your brief has been sent. First reply within one business day.", false);
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
