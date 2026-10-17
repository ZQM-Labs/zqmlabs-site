#!/usr/bin/env node
/**
 * Check local links and asset references in the generated Hugo site.
 * External URLs are intentionally not fetched; this validates the published
 * site's own files without making CI dependent on third-party availability.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || "public");
const siteOrigin = "https://zqmlabs.com";
const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) htmlFiles.push(full);
  }
}

function publishedFile(pathname, sourceFile) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); }
  catch { return { error: "invalid percent-encoding" }; }

  const clean = decoded.replace(/\\/g, "/");
  const target = clean.startsWith("/")
    ? path.resolve(root, "." + clean)
    : path.resolve(path.dirname(sourceFile), clean);

  if (target !== root && !target.startsWith(root + path.sep)) {
    return { error: "path escapes the published site" };
  }

  const candidates = [];
  if (path.extname(target)) candidates.push(target);
  else {
    candidates.push(path.join(target, "index.html"), target + ".html", target);
  }
  const found = candidates.find(candidate => {
    try { return fs.statSync(candidate).isFile(); } catch { return false; }
  });
  return found ? { file: found } : { error: "target file not found" };
}

if (!fs.existsSync(root)) {
  console.error(`Built site directory not found: ${root}`);
  process.exit(2);
}
walk(root);

const failures = [];
let checked = 0;
const attributePattern = /\\b(?:href|src|action|poster)\\s*=\\s*(?:"([^"]*)"|'([^']*)')/gi;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(attributePattern)) {
    const raw = (match[1] ?? match[2] ?? "").trim();
    if (!raw || raw.startsWith("#") || /^(?:data:|javascript:|mailto:|tel:|sms:|blob:)/i.test(raw) || raw.startsWith("//")) continue;

    let pathname;
    try {
      if (/^https?:\\/\\//i.test(raw)) {
        const url = new URL(raw);
        if (url.origin !== siteOrigin && url.origin !== siteOrigin.replace("https:", "http:")) continue;
        pathname = url.pathname;
      } else {
        pathname = new URL(raw, "https://zqmlabs.com/" + path.relative(root, file).split(path.sep).join("/")).pathname;
      }
    } catch {
      failures.push(`${path.relative(root, file)}: invalid URL "${raw}"`);
      continue;
    }

    checked++;
    const result = publishedFile(pathname, file);
    if (result.error) failures.push(`${path.relative(root, file)}: ${raw} (${result.error})`);
  }
}

if (failures.length) {
  console.error(`Found ${failures.length} broken local links/assets among ${checked} checked references:`);
  for (const failure of failures) console.error(" - " + failure);
  process.exit(1);
}
console.log(`Verified ${checked} local links/assets across ${htmlFiles.length} generated HTML pages.`);
