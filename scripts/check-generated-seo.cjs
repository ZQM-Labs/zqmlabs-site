#!/usr/bin/env node
"use strict";

// Validate rendered SEO metadata, not just the source template. This script
// intentionally uses Node built-ins so CI needs no additional parser package.
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(process.argv[2] || "public");
const canonicalOrigin = "https://zqmlabs.com/";
const errors = [];
let pages = 0;

function attributes(tag) {
  const result = {};
  const pattern = /([^\\s=]+)\\s*=\\s*["']([^"']*)["']/g;
  let match;
  while ((match = pattern.exec(tag)) !== null) {
    result[match[1].toLowerCase()] = match[2];
  }
  return result;
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.isFile() && entry.name.toLowerCase().endsWith(".html") ? [full] : [];
  });
}

if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
  console.error(`Generated site directory does not exist: ${root}`);
  process.exit(2);
}

for (const file of walk(root)) {
  pages += 1;
  const relative = path.relative(root, file).split(path.sep).join("/");
  const html = fs.readFileSync(file, "utf8");
  const titleMatch = html.match(/<title\\b[^>]*>([\\s\\S]*?)<\\/title>/i);
  if (!titleMatch || !titleMatch[1].replace(/<[^>]+>/g, "").trim()) {
    errors.push(`${relative}: missing or empty <title>`);
  }

  const meta = new Map();
  for (const tag of html.match(/<meta\\b[^>]*>/gi) || []) {
    const attrs = attributes(tag);
    const key = (attrs.name || attrs.property || "").toLowerCase();
    if (key) meta.set(key, attrs.content || "");
  }
  if (!meta.get("description")?.trim()) errors.push(`${relative}: missing meta description`);
  if (!meta.get("og:title")?.trim()) errors.push(`${relative}: missing og:title`);
  if (!meta.get("og:description")?.trim()) errors.push(`${relative}: missing og:description`);
  if (!meta.get("og:url")?.trim()) errors.push(`${relative}: missing og:url`);
  if (!meta.get("twitter:card")?.trim()) errors.push(`${relative}: missing twitter:card`);

  const canonicalTag = (html.match(/<link\\b[^>]*rel=["']canonical["'][^>]*>/i) || [])[0];
  const canonical = canonicalTag ? attributes(canonicalTag).href : "";
  if (!canonical) {
    errors.push(`${relative}: missing canonical URL`);
  } else if (!canonical.startsWith(canonicalOrigin) || canonical.includes("localhost")) {
    errors.push(`${relative}: canonical URL is not on ${canonicalOrigin}: ${canonical}`);
  }

  const jsonLdBlocks = [...html.matchAll(/<script\\b[^>]*type=["']application\\/ld\\+json["'][^>]*>([\\s\\S]*?)<\\/script>/gi)];
  if (jsonLdBlocks.length === 0) {
    errors.push(`${relative}: missing JSON-LD structured data`);
  } else {
    for (const [index, block] of jsonLdBlocks.entries()) {
      try {
        JSON.parse(block[1]);
      } catch (error) {
        errors.push(`${relative}: JSON-LD block ${index + 1} is invalid JSON (${error.message})`);
      }
    }
  }
}

if (pages === 0) errors.push(`No generated HTML pages found under ${root}`);
if (errors.length) {
  console.error(`Generated SEO validation failed: ${errors.length} issue(s) across ${pages} HTML page(s).`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Generated SEO validation passed for ${pages} HTML page(s): title, descriptions, canonical URLs, Open Graph, Twitter cards, and parseable JSON-LD.`);
