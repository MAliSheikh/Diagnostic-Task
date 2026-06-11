/**
 * js/main.js — SKA Diagnostic Frontend Logic
 *
 * Handles:
 *  1. Access-code gate validation
 *  2. Radio option highlight state
 *  3. Form submission via fetch → /api/submit
 *  4. Screen transitions (gate → form → confirmation)
 */

(function () {
  "use strict";

  /* ── Config ── */
  const ACCESS_CODE    = "SKA2026";
  const SUBMIT_ENDPOINT = "/api/submit";

  /* ── DOM references ── */
  const screens = {
    gate:    document.getElementById("screen-gate"),
    form:    document.getElementById("screen-form"),
    success: document.getElementById("screen-success"),
  };

  const els = {
    accessInput:  document.getElementById("access-code"),
    unlockBtn:    document.getElementById("btn-unlock"),
    codeError:    document.getElementById("error-code"),
    diagForm:     document.getElementById("diagnostic-form"),
    submitBtn:    document.getElementById("btn-submit"),
    submitError:  document.getElementById("error-submit"),
    radioOptions: document.querySelectorAll(".radio-option"),
  };

  /* ── Helpers ── */
  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[name].classList.add("active");
  }

  function setAlert(el, message, visible) {
    if (message) el.textContent = message;
    el.classList.toggle("visible", visible);
  }

  function setLoading(btn, isLoading) {
    btn.disabled = isLoading;
    btn.innerHTML = isLoading
      ? '<span class="spinner" aria-hidden="true"></span>Submitting…'
      : btn.dataset.label;
  }

  /* ── Radio highlight ── */
  els.radioOptions.forEach(label => {
    const input = label.querySelector("input[type='radio']");
    input.addEventListener("change", () => {
      els.radioOptions.forEach(l => l.classList.remove("selected"));
      label.classList.add("selected");
    });
  });

  /* ── Step 1: Access code gate ── */
  function handleUnlock() {
    const entered = els.accessInput.value.trim();
    if (entered === ACCESS_CODE) {
      setAlert(els.codeError, null, false);
      showScreen("form");
    } else {
      setAlert(els.codeError, "Invalid access code. Please try again.", true);
      els.accessInput.select();
    }
  }

  els.unlockBtn.addEventListener("click", handleUnlock);

  els.accessInput.addEventListener("keydown", e => {
    if (e.key === "Enter") handleUnlock();
  });

  /* ── Step 2: Form submission ── */
  els.diagForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name         = document.getElementById("field-name").value.trim();
    const organisation = document.getElementById("field-org").value.trim();
    const commRadio    = document.querySelector("input[name='communication']:checked");

    if (!commRadio) {
      setAlert(els.submitError, "Please select a communication option.", true);
      return;
    }

    setAlert(els.submitError, null, false);
    setLoading(els.submitBtn, true);

    try {
      const response = await fetch(SUBMIT_ENDPOINT, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name,
          organisation,
          communication: commRadio.value,
        }),
      });

      if (!response.ok) throw new Error(`Server responded with ${response.status}`);

      showScreen("success");

    } catch (err) {
      console.error("Submission error:", err);
      setAlert(els.submitError, "Something went wrong. Please try again.", true);
      setLoading(els.submitBtn, false);
    }
  });

  /* ── Init: show gate screen ── */
  showScreen("gate");

})();
