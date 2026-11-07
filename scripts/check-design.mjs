import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = new URL("../", import.meta.url);
const read = path => readFileSync(new URL(path, root), "utf8");
const html = read("index.html");
const css = read("styles.css");
const app = read("app.js");
const readme = read("README.md");
const errors = [];
const requires = (condition, message) => { if (!condition) errors.push(message); };

for (const id of [
  "q", "lang", "tone", "batch", "draft-list", "subject", "body",
  "copy-ready", "copy-template", "reset-draft", "review-label",
  "token-list", "load-error"
]) requires(html.includes('id="' + id + '"'), "Missing UI control #" + id);
requires(html.includes('lang="de"'), "Document language must be de");
requires(html.includes('name="viewport"'), "Missing responsive viewport");
requires(html.includes("Content-Security-Policy"), "Missing static CSP");
requires(html.includes('href="#workspace"'), "Missing keyboard skip link");
requires(html.includes('type="module" src="./app.js"'), "Browser JS must be loaded as a module");
requires(html.includes('role="status"') && html.includes('aria-live="polite"'), "Missing status announcements");
requires(css.includes(":focus-visible"), "Missing visible keyboard focus state");
requires(css.includes("@media(max-width:640px)"), "Missing small-screen breakpoint");
requires(css.includes("prefers-reduced-motion"), "Reduced-motion preference not supported");
requires(!app.includes(".innerHTML"), "No untrusted content may be inserted with innerHTML");
requires(!app.includes("localStorage") && !app.includes("sessionStorage"), "Editor must not persist user content");
requires(!app.includes("fetch(") || /fetch\("\.\/data\/drafts\.json"/.test(app), "Only same-origin catalog fetch permitted");
requires(!/<(?:script|link|img)\\b[^>]+(?:src|href)="https?:\\/\\//i.test(html), "Do not load remote scripts, styles, or images into the application");
requires(!html.includes('onclick='), "Inline event handlers are not permitted");

const refs = new Set();
for (const match of readme.matchAll(/\]\(\.\/([^#?)]+)(?:#[^)]*)?\)/g)) {
  refs.add(match[1]);
}
for (const match of html.matchAll(/(?:href|src)="\.\/([^#?"]+)/g)) refs.add(match[1]);
for (const path of refs) {
  const target = new URL(path, root);
  requires(target.href.startsWith(root.href), "Unsafe relative link: " + path);
  if (target.href.startsWith(root.href)) requires(existsSync(target), "Broken local file link: " + path);
}

if (errors.length) {
  for (const error of errors) console.error("FAIL:", error);
  process.exit(1);
}
console.log("Design and local link checks passed (" + refs.size + " references).");
