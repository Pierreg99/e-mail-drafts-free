import { filterDrafts, checkReady, validateCatalog } from "./src/catalog.mjs";

const state = {
  catalog: null,
  selected: null,
  filters: { search: "", lang: "all", batch: "all", tone: "all" }
};
const $ = selector => document.querySelector(selector);
const languageLabels = { de: "Deutsch", en: "English", multi: "Zweisprachig" };
const toneLabels = { formal: "Formell", firm: "Bestimmt", brief: "Kurz", warm: "Freundlich" };

function createElement(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function getBatch(id) {
  return state.catalog.batches.find(batch => batch.id === id);
}

function populateBatches() {
  const target = $("#batch");
  for (const batch of state.catalog.batches) {
    const item = document.createElement("option");
    item.value = batch.id;
    item.textContent = batch.title_de + " / " + batch.title;
    target.append(item);
  }
}

function renderList() {
  if (!state.catalog) return;
  const visible = filterDrafts(state.catalog, state.filters);
  $("#result-count").textContent = visible.length + " / " + state.catalog.drafts.length;
  $("#empty-state").hidden = visible.length !== 0;
  const fragment = document.createDocumentFragment();
  for (const draft of visible) {
    const batch = getBatch(draft.batch);
    const button = createElement("button", "draft-item");
    button.type = "button";
    button.setAttribute("aria-pressed", String(state.selected?.id === draft.id));
    button.setAttribute("aria-label", "Vorlage öffnen: " + draft.subject);
    const meta = createElement("span", "item-meta");
    meta.append(
      createElement("span", "", languageLabels[draft.lang] || draft.lang),
      createElement("span", "", "·"),
      createElement("span", "", toneLabels[draft.tone] || draft.tone)
    );
    button.append(meta, createElement("strong", "", draft.subject), createElement("p", "", batch?.title_de || draft.batch));
    button.addEventListener("click", () => selectDraft(draft.id));
    fragment.append(button);
  }
  $("#draft-list").replaceChildren(fragment);
}

function selectDraft(id) {
  const draft = state.catalog?.drafts.find(item => item.id === id);
  if (!draft) return;
  state.selected = draft;
  $("#editor-empty").hidden = true;
  $("#editor-content").hidden = false;
  const batch = getBatch(draft.batch);
  $("#selected-batch").textContent = batch?.title_de || draft.batch;
  $("#selected-language").textContent = languageLabels[draft.lang] || draft.lang;
  $("#selected-tone").textContent = toneLabels[draft.tone] || draft.tone;
  $("#subject").value = draft.subject;
  $("#body").value = draft.body;
  $("#copy-status").textContent = "";
  updateReview();
  renderList();
}

function updateReview() {
  const { ready, missing } = checkReady($("#subject").value, $("#body").value);
  $("#copy-ready").disabled = !ready;
  const panel = $(".review-panel");
  panel.classList.toggle("is-ready", ready);
  $("#review-label").textContent = ready ? "Keine offenen Platzhalter" : "Platzhalterprüfung offen";
  $("#token-count").textContent = missing.length + " offen";
  $("#review-help").textContent = ready
    ? "Die Platzhalterprüfung ist bestanden. Inhalt, Empfänger und rechtliche Aussagen musst du selbst kontrollieren."
    : "Ergänze alle angezeigten Platzhalter; leere Betreff- oder Textfelder sind ebenfalls unvollständig.";
  const fragment = document.createDocumentFragment();
  for (const token of missing) fragment.append(createElement("span", "", token));
  $("#token-list").replaceChildren(fragment);
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Local and sandboxed contexts may deny clipboard access. Try the legacy fallback.
    }
  }
  const scratch = document.createElement("textarea");
  scratch.value = value;
  scratch.readOnly = true;
  scratch.style.position = "fixed";
  scratch.style.opacity = "0";
  document.body.append(scratch);
  scratch.focus();
  scratch.select();
  let copied = false;
  try { copied = document.execCommand("copy"); }
  finally { scratch.remove(); }
  if (!copied) throw new Error("Clipboard access denied");
}

async function copyDraft(mode) {
  if (!state.selected) return;
  const isTemplate = mode === "template";
  const subject = isTemplate ? state.selected.subject : $("#subject").value;
  const body = isTemplate ? state.selected.body : $("#body").value;
  if (!isTemplate && !checkReady(subject, body).ready) {
    $("#copy-status").textContent = "Kopieren gesperrt: Bitte alle Platzhalter ausfüllen.";
    return;
  }
  try {
    await copyText(subject + "\n\n" + body);
    $("#copy-status").textContent = isTemplate
      ? "Vorlage kopiert – Platzhalter vor dem Senden ersetzen."
      : "Text kopiert – bitte Inhalt und Empfänger vor dem Senden prüfen.";
  } catch {
    $("#copy-status").textContent = "Kopieren nicht möglich. Markiere und kopiere Betreff und Nachricht manuell.";
  }
}

function bindEvents() {
  $("#q").addEventListener("input", event => {
    state.filters.search = event.target.value;
    renderList();
  });
  for (const id of ["lang", "batch", "tone"]) {
    $("#" + id).addEventListener("change", event => {
      state.filters[id] = event.target.value;
      renderList();
    });
  }
  $("#clear-filters").addEventListener("click", () => {
    state.filters = { search: "", lang: "all", batch: "all", tone: "all" };
    $("#q").value = "";
    for (const id of ["lang", "batch", "tone"]) $("#" + id).value = "all";
    renderList();
    $("#q").focus();
  });
  $("#subject").addEventListener("input", updateReview);
  $("#body").addEventListener("input", updateReview);
  $("#copy-ready").addEventListener("click", () => copyDraft("ready"));
  $("#copy-template").addEventListener("click", () => copyDraft("template"));
  $("#reset-draft").addEventListener("click", () => {
    if (state.selected) selectDraft(state.selected.id);
  });
}

async function boot() {
  bindEvents();
  try {
    const response = await fetch("./data/drafts.json", { cache: "no-store" });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const catalog = await response.json();
    const errors = validateCatalog(catalog);
    if (errors.length) throw new Error(errors.slice(0, 3).join("; "));
    state.catalog = catalog;
    $("#total-count").textContent = String(catalog.drafts.length);
    $("#batch-count").textContent = String(catalog.batches.length);
    populateBatches();
    if (catalog.drafts.length) {
      selectDraft(catalog.drafts.find(item => item.lang === "de")?.id ?? catalog.drafts[0].id);
    } else {
      renderList();
    }
  } catch (error) {
    $("#result-count").textContent = "Fehler";
    $("#load-error").hidden = false;
    $("#load-error").textContent = "Katalog konnte nicht geladen werden. Bitte per lokalem HTTP-Server starten (siehe README). Details: " + error.message;
  }
}

boot();
