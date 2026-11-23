"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const script = fs.readFileSync(path.join(root, "static/computing/brief-form.js"), "utf8");
const inquiry = fs.readFileSync(path.join(root, "content/computing/inquiry.md"), "utf8");

function mountedForm(responseFactory) {
  const fields = Object.fromEntries([
    "brief-name", "brief-email", "brief-organisation", "brief-service-type",
    "brief-text", "brief-website"
  ].map(id => [id, { value: "" }]));
  fields["brief-name"].value = " Test Person ";
  fields["brief-email"].value = " buyer@example.com ";
  fields["brief-organisation"].value = " Test Organisation ";
  fields["brief-service-type"].value = "workflow";
  fields["brief-text"].value = " GIS automation request ";
  const status = { textContent: "", className: "" };
  const button = { disabled: false };
  const requests = [];
  let loaded;
  let onSubmit;
  const form = {
    resetCount: 0,
    querySelector: selector => {
      assert.equal(selector, 'button[type="submit"]');
      return button;
    },
    addEventListener: (event, callback) => {
      assert.equal(event, "submit");
      onSubmit = callback;
    },
    reset() { this.resetCount++; }
  };
  const document = {
    addEventListener(event, callback) {
      assert.equal(event, "DOMContentLoaded");
      loaded = callback;
    },
    getElementById(id) {
      if (id === "brief-form") return form;
      if (id === "brief-form-status") return status;
      return fields[id] || null;
    },
    querySelectorAll(selector) {
      assert.equal(selector, "button[data-copy-target]");
      return [];
    }
  };
  vm.runInNewContext(script, {
    document,
    fetch: (url, options) => {
      requests.push({ url, options });
      return Promise.resolve().then(responseFactory);
    }
  }, { filename: "brief-form.js", timeout: 1000 });
  assert.equal(typeof loaded, "function");
  loaded();
  return {
    fields, form, status, button, requests,
    async submit() {
      assert.equal(typeof onSubmit, "function");
      onSubmit({ preventDefault() {} });
      await new Promise(resolve => setImmediate(resolve));
    }
  };
}

test("public Computing inquiry page is email-only until the backend is verified", () => {
  assert.match(inquiry, /mailto:zqmcomputing@gmail\.com/);
  assert.doesNotMatch(inquiry, /<form\b[^>]*id=["']brief-form["']/i);
  assert.doesNotMatch(inquiry, /First reply within one business day/i);
});

test("staged script submits the canonical schema and accepts 201 plus reference", async () => {
  const form = mountedForm(() => ({
    status: 201, json: async () => ({ ok: true, reference: "test-reference" })
  }));
  await form.submit();
  assert.equal(form.requests.length, 1);
  assert.equal(form.requests[0].url, "https://api.zqmlabs.com/api/inquiries");
  assert.equal(form.requests[0].options.method, "POST");
  assert.deepEqual(JSON.parse(form.requests[0].options.body), {
    name: "Test Person",
    email: "buyer@example.com",
    organisation: "Test Organisation",
    brief_type: "workflow",
    brief_text: "GIS automation request",
    source: "form",
    website: ""
  });
  assert.equal(form.form.resetCount, 1);
  assert.equal(form.button.disabled, false);
  assert.match(form.status.textContent, /submitted/i);
  assert.doesNotMatch(form.status.textContent, /one business day/i);
});

test("generic 200 or missing receipt reference fails closed", async () => {
  for (const response of [
    { status: 200, json: async () => ({ ok: true }) },
    { status: 201, json: async () => ({ ok: true }) }
  ]) {
    const form = mountedForm(() => response);
    await form.submit();
    assert.equal(form.requests.length, 1);
    assert.equal(form.form.resetCount, 0);
    assert.match(form.status.textContent, /email it instead/i);
    assert.equal(form.button.disabled, false);
  }
});

test("invalid email or unknown service is rejected before fetch", async () => {
  for (const [field, value] of [
    ["brief-email", "not-an-email"],
    ["brief-service-type", "workflow-automation"],
    ["brief-name", ""],
    ["brief-organisation", "x".repeat(201)],
    ["brief-text", ""]
  ]) {
    const form = mountedForm(() => ({ status: 201, json: async () => ({ ok: true, reference: "x" }) }));
    form.fields[field].value = value;
    await form.submit();
    assert.equal(form.requests.length, 0, field);
    assert.equal(form.status.className, "brief-error");
  }
});

test("client carries a honeypot value for backend rejection", async () => {
  const form = mountedForm(() => ({ status: 201, json: async () => ({ ok: true, reference: "decoy" }) }));
  form.fields["brief-website"].value = "spam.example";
  await form.submit();
  assert.equal(JSON.parse(form.requests[0].options.body).website, "spam.example");
});

test("network failures retain the email fallback and do not claim receipt", async () => {
  const form = mountedForm(() => Promise.reject(new Error("offline")));
  await form.submit();
  assert.equal(form.form.resetCount, 0);
  assert.match(form.status.textContent, /email it instead/i);
  assert.equal(form.button.disabled, false);
});
