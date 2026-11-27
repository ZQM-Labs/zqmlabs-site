// Send a structured GIS inquiry to POST /api/inquiries. No analytics.
// Client-side validation mirrors the hook's rules; the hook itself is the
// authority and its 400/429 message is shown on failure. A 201 returns a
// reference number to quote in later emails. The n8n notification workflow
// is not configured yet, so no email is sent automatically. Mailto stays as
// the fallback: on any failure the page's email links are right below the form.
document.addEventListener("DOMContentLoaded", function () {
  var ENDPOINT = "https://api.zqmlabs.com/api/inquiries";
  var BRIEF_TYPES = ["generic", "map-production", "web-gis", "workflow"];
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var SEND_FAILED = "Could not send your inquiry right now — please email it instead.";
  var RATE_LIMITED = "Too many inquiries sent recently — please wait a while and try again, or email your inquiry instead.";

  var form = document.getElementById("inquiry-form");
  if (!form) return;
  var nameInput = document.getElementById("inquiry-name");
  var emailInput = document.getElementById("inquiry-email");
  var orgInput = document.getElementById("inquiry-organisation");
  var typeSelect = document.getElementById("inquiry-brief-type");
  var briefInput = document.getElementById("inquiry-brief-text");
  var budgetInput = document.getElementById("inquiry-budget-range");
  var timingInput = document.getElementById("inquiry-timing");
  var honeypotInput = document.getElementById("inquiry-website");
  var statusEl = document.getElementById("inquiry-form-status");
  var submitBtn = form.querySelector('button[type="submit"]');

  function setStatus(text, isError) {
    statusEl.textContent = text;
    statusEl.className = isError ? "inquiry-error" : "inquiry-success";
  }

  // Same rules as POST /api/inquiries in pb_hooks/main.pb.js. The hook
  // returns a single generic "invalid request", so the client gives the
  // field-specific message instead.
  function validate() {
    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var org = orgInput.value.trim();
    var type = typeSelect.value;
    var brief = briefInput.value.trim();
    var budget = budgetInput.value.trim();
    var timing = timingInput.value.trim();
    if (!name || name.length > 120) return "name is required (max 120 characters)";
    if (!email || email.length > 254 || !EMAIL_RE.test(email)) return "a valid email is required";
    if (org.length > 200) return "organisation must be at most 200 characters";
    if (BRIEF_TYPES.indexOf(type) === -1) return "brief_type must be one of: " + BRIEF_TYPES.join(", ");
    if (!brief || brief.length > 20000) return "brief_text is required (max 20000 characters)";
    if (budget.length > 120) return "budget_range must be at most 120 characters";
    if (timing.length > 200) return "timing must be at most 200 characters";
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
      brief_type: typeSelect.value,
      brief_text: briefInput.value.trim(),
      budget_range: budgetInput.value.trim(),
      timing: timingInput.value.trim(),
      source: "form",
      website: honeypotInput.value
    };
    submitBtn.disabled = true;
    setStatus("Sending your inquiry…", false);
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (resp) {
      if (resp.status === 429) return { ok: false, error: RATE_LIMITED };
      if (resp.ok) {
        return resp.json().then(function (data) {
          return { ok: true, reference: (data && data.reference) || "" };
        }).catch(function () {
          return { ok: true, reference: "" };
        });
      }
      return resp.json().then(function (data) {
        return { ok: false, error: (data && data.error) || SEND_FAILED };
      }).catch(function () {
        return { ok: false, error: SEND_FAILED };
      });
    }).then(function (result) {
      if (result.ok) {
        form.reset();
        var msg = "Thank you — your inquiry has been sent. First reply within one business day.";
        if (result.reference) msg += " Your reference is " + result.reference + " — please quote it in later emails.";
        setStatus(msg, false);
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
