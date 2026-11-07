import { readFileSync, existsSync } from "node:fs";
import { validateCatalog } from "../src/catalog.mjs";

const root = new URL("../", import.meta.url);
const read = path => readFileSync(new URL(path, root), "utf8");
const catalog = JSON.parse(read("data/drafts.json"));
const manifest = JSON.parse(read("MANIFEST.json"));
const index = read("drafts/INDEX.md");
const errors = validateCatalog(catalog);
let mdChecked = 0;
let pdfChecked = 0;

if (manifest.batches !== catalog.batches.length || manifest.drafts !== catalog.drafts.length) {
  errors.push("Manifest catalog counts differ from data/drafts.json.");
}
for (const d of catalog.drafts) {
  if (!/^[a-z0-9-]+$/.test(d.id)) {
    errors.push("Unsafe draft ID: " + d.id);
    continue;
  }
  const mdPath = "drafts/md/" + d.id + ".md";
  const pdfPath = "drafts/pdf/" + d.id + ".pdf";
  if (!index.includes("(" + "md/" + d.id + ".md)")) errors.push("Index missing markdown: " + d.id);
  if (!index.includes("(" + "pdf/" + d.id + ".pdf)")) errors.push("Index missing PDF: " + d.id);
  if (!existsSync(new URL(mdPath, root))) {
    errors.push("Markdown export missing: " + d.id);
  } else {
    const md = read(mdPath);
    const tokensLine = md.match(/^- Tokens: (.*)$/m)?.[1];
    const marker = md.split("## Subject\n\n")[1];
    const subject = marker?.split("\n\n## Body")[0]?.trim();
    const body = md.split("## Body\n\n")[1]?.trim();
    const declared = tokensLine?.split(", ").sort() ?? [];
    if (subject !== d.subject.trim()) errors.push(d.id + ": exported subject drift.");
    if (body !== d.body.trim()) errors.push(d.id + ": exported body drift.");
    if (JSON.stringify(declared) !== JSON.stringify([...new Set(d.tokens)].sort())) {
      errors.push(d.id + ": exported token metadata drift.");
    }
    mdChecked += 1;
  }
  if (!existsSync(new URL(pdfPath, root))) {
    errors.push("PDF export missing: " + d.id);
  } else {
    const pdf = readFileSync(new URL(pdfPath, root));
    const header = pdf.subarray(0, 8).toString("ascii");
    const tail = pdf.subarray(Math.max(0, pdf.length - 128)).toString("latin1");
    if (pdf.length < 300 || !header.startsWith("%PDF-") || !tail.includes("%%EOF")) {
      errors.push(d.id + ": PDF missing header, EOF marker or content length.");
    }
    pdfChecked += 1;
  }
}
if (errors.length) {
  for (const error of errors) console.error("FAIL:", error);
  process.exit(1);
}
console.log("Exports valid: " + mdChecked + " Markdown texts match JSON; " +
  pdfChecked + " PDF files passed structural presence/header/EOF checks.");
console.log("Note: PDF text equivalence is NOT proved by this structural check.");
