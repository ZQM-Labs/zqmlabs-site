// Copy a brief template to the clipboard. No backend; same-origin static file.
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("button[data-copy-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var el = document.getElementById(btn.getAttribute("data-copy-target"));
      if (!el) return;
      var text = el.innerText;
      var done = function () {
        var original = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = original; }, 2000);
      };
      var fallback = function () {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); }
        catch (e) { btn.textContent = "Select the text above to copy"; }
        document.body.removeChild(ta);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else { fallback(); }
    });
  });
});
