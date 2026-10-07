const state = { data: null, q: "", lang: "all", batch: "all", tone: "all" };

const langName = { en: "English", de: "Deutsch", multi: "Multilingual" };

async function boot() {
  const res = await fetch("data/drafts.json");
  state.data = await res.json();
  fillBatches();
  bind();
  render();
}

function fillBatches() {
  const select = document.querySelector("#batch");
  for (const batch of state.data.batches) {
    const option = document.createElement("option");
    option.value = batch.id;
    option.textContent = batch.title;
    select.append(option);
  }
}

function bind() {
  document.querySelector("#q").addEventListener("input", (event) => {
    state.q = event.target.value.trim().toLowerCase();
    render();
  });
  for (const id of ["lang", "batch", "tone"]) {
    document.querySelector("#" + id).addEventListener("change", (event) => {
      state[id] = event.target.value;
      render();
    });
  }
}

function visible() {
  return state.data.drafts.filter((draft) => {
    if (state.lang !== "all" && draft.lang !== state.lang) return false;
    if (state.batch !== "all" && draft.batch !== state.batch) return false;
    if (state.tone !== "all" && draft.tone !== state.tone) return false;
    if (!state.q) return true;
    const hay = (draft.subject + " " + draft.body + " " + draft.batch).toLowerCase();
    return hay.includes(state.q);
  });
}

function render() {
  const list = visible();
  document.querySelector("#count").textContent = list.length + " of " + state.data.drafts.length;
  const root = document.querySelector("#list");
  root.replaceChildren();
  for (const draft of list) root.append(card(draft));
}

function card(draft) {
  const batch = state.data.batches.find((item) => item.id === draft.batch);
  const node = document.createElement("article");
  node.className = "card";
  node.innerHTML = `
    <div class="meta">
      <span class="pill">${langName[draft.lang]}</span>
      <span class="pill">${draft.tone}</span>
      <span class="pill">${batch.title}</span>
    </div>
    <p class="subject"></p>
    <pre></pre>
    <div class="actions">
      <button type="button" data-copy="both">Copy both</button>
      <button type="button" data-copy="subject">Copy subject</button>
      <button type="button" data-copy="body">Copy body</button>
    </div>
    <p class="tokens"></p>`;
  node.querySelector(".subject").textContent = draft.subject;
  node.querySelector("pre").textContent = draft.body;
  node.querySelector(".tokens").textContent = "Replace: " + draft.tokens.join(", ");
  node.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => copyDraft(draft, button.dataset.copy, button));
  });
  return node;
}

async function copyDraft(draft, part, button) {
  const text = part === "subject" ? draft.subject : part === "body" ? draft.body : draft.subject + "\n\n" + draft.body;
  await navigator.clipboard.writeText(text);
  const old = button.textContent;
  button.textContent = "Copied";
  setTimeout(() => { button.textContent = old; }, 900);
}

boot();
