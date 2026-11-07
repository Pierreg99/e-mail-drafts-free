import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { checkReady, draftTokens, extractTokens, filterDrafts, validateCatalog } from "../src/catalog.mjs";

const catalog = JSON.parse(readFileSync(new URL("../data/drafts.json", import.meta.url), "utf8"));

test("full catalog schema and variants", () => {
  assert.deepEqual(validateCatalog(catalog), []);
  assert.equal(catalog.batches.length, 12);
  assert.equal(catalog.drafts.length, 36);
});
test("token matching handles spaces and deduplicates", () => {
  assert.deepEqual(extractTokens("[NAME], [END DATE], [NAME]"), ["[END DATE]", "[NAME]"]);
});
test("every listed token appears in its subject or body", () => {
  for (const draft of catalog.drafts) assert.deepEqual(draftTokens(draft), [...new Set(draft.tokens)].sort(), draft.id);
});
test("readiness is blocked by placeholders and blank fields", () => {
  assert.equal(checkReady("Subject", "Hello [NAME]").ready, false);
  assert.equal(checkReady(" ", "Body").ready, false);
  assert.equal(checkReady("Subject", "Body").ready, true);
  assert.deepEqual(checkReady("Subject [END DATE]", "Hello [NAME]").missing, ["[END DATE]", "[NAME]"]);
});
test("filters cover language, batch, tone and text without altering data", () => {
  assert.equal(filterDrafts(catalog, { lang: "de" }).length, 12);
  assert.equal(filterDrafts(catalog, { lang: "multi", batch: "repair" }).length, 1);
  assert.ok(filterDrafts(catalog, { tone: "warm" }).length > 0);
  assert.equal(filterDrafts(catalog, { search: "search-term-not-present-12345" }).length, 0);
  assert.equal(filterDrafts(catalog, {}).length, catalog.drafts.length);
});
test("untrusted catalog structures get rejected", () => {
  const modified = structuredClone(catalog);
  modified.drafts[0].id = modified.drafts[1].id;
  assert.ok(validateCatalog(modified).some(x => x.includes("duplicate draft id")));
  modified.drafts[0].id = "other";
  modified.drafts[0].tokens = [];
  assert.ok(validateCatalog(modified).some(x => x.includes("token metadata")));
});
