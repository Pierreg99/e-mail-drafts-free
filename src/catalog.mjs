/** Pure catalog utilities shared by the browser and Node.js tests. */
export const LANGUAGES = Object.freeze(["en", "de", "multi"]);
export const TONES = Object.freeze(["formal", "firm", "brief", "warm"]);
const TOKEN_PATTERN = /\[[A-Z][A-Z0-9 _-]{0,38}\]/g;

export function extractTokens(text) {
  return [...new Set(String(text ?? "").match(TOKEN_PATTERN) ?? [])].sort();
}

export function draftTokens(draft) {
  return extractTokens(String(draft.subject ?? "") + "\n" + String(draft.body ?? ""));
}

export function checkReady(subject, body) {
  const missing = extractTokens(String(subject ?? "") + "\n" + String(body ?? ""));
  return { ready: Boolean(String(subject ?? "").trim() && String(body ?? "").trim() && missing.length === 0), missing };
}

export function filterDrafts(catalog, filters = {}) {
  const { search = "", lang = "all", batch = "all", tone = "all" } = filters;
  const query = String(search).trim().toLocaleLowerCase();
  const names = new Map(catalog.batches.map(item => [item.id, item]));
  return catalog.drafts.filter(draft => {
    if (lang !== "all" && draft.lang !== lang) return false;
    if (batch !== "all" && draft.batch !== batch) return false;
    if (tone !== "all" && draft.tone !== tone) return false;
    const group = names.get(draft.batch) ?? {};
    const haystack = [draft.subject, draft.body, group.title, group.title_de, draft.id].join(" ").toLocaleLowerCase();
    return !query || haystack.includes(query);
  });
}

export function validateCatalog(catalog) {
  const errors = [];
  if (!catalog || !Array.isArray(catalog.batches) || !Array.isArray(catalog.drafts)) {
    return ["Catalog must contain batches[] and drafts[]."];
  }
  const batches = new Set();
  for (const batch of catalog.batches) {
    if (!batch || typeof batch.id !== "string" || !batch.id.trim() || !batch.title || !batch.title_de) {
      errors.push("A batch is missing a valid id, title or title_de.");
      continue;
    }
    if (batches.has(batch.id)) errors.push("Duplicate batch: " + batch.id);
    batches.add(batch.id);
  }
  const ids = new Set();
  const variants = new Set();
  for (const draft of catalog.drafts) {
    if (!draft || typeof draft !== "object") { errors.push("Invalid draft object."); continue; }
    const id = String(draft.id ?? "");
    if (!id || ids.has(id)) errors.push("Missing or duplicate draft id: " + id);
    ids.add(id);
    if (!batches.has(draft.batch)) errors.push(id + ": unknown batch " + draft.batch);
    if (!LANGUAGES.includes(draft.lang)) errors.push(id + ": invalid language");
    if (!TONES.includes(draft.tone)) errors.push(id + ": invalid tone");
    if (typeof draft.subject !== "string" || !draft.subject.trim() ||
        typeof draft.body !== "string" || !draft.body.trim()) errors.push(id + ": empty subject/body");
    if (!Array.isArray(draft.tokens) || draft.tokens.some(t => typeof t !== "string")) {
      errors.push(id + ": tokens must be a string array");
    } else {
      const actual = draftTokens(draft);
      const declared = [...new Set(draft.tokens)].sort();
      if (JSON.stringify(actual) !== JSON.stringify(declared)) errors.push(id + ": token metadata differs from subject/body");
    }
    const variant = String(draft.batch) + "/" + String(draft.lang);
    if (variants.has(variant)) errors.push(id + ": duplicate batch/language pair");
    variants.add(variant);
  }
  for (const batch of batches) {
    for (const lang of LANGUAGES) {
      if (!variants.has(batch + "/" + lang)) errors.push("Missing variant: " + batch + "/" + lang);
    }
  }
  return errors;
}
