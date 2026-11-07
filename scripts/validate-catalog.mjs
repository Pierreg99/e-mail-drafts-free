import { readFileSync } from "node:fs";
import { validateCatalog } from "../src/catalog.mjs";

let catalog;
try {
  catalog = JSON.parse(readFileSync(new URL("../data/drafts.json", import.meta.url), "utf8"));
} catch (error) {
  console.error("Catalog is not valid JSON:", error.message);
  process.exit(1);
}
const errors = validateCatalog(catalog);
if (errors.length) {
  for (const error of errors) console.error("FAIL:", error);
  process.exit(1);
}
console.log("Catalog valid:", catalog.batches.length, "batches,", catalog.drafts.length, "drafts; EN / DE / MULTI variants checked.");
