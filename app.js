const state = {
  search: "",
  category: "All",
  evidence: "All",
};

const entryList = document.getElementById("entryList");
const categoryChips = document.getElementById("categoryChips");
const evidenceChips = document.getElementById("evidenceChips");
const summaryGrid = document.getElementById("summaryGrid");
const statGrid = document.getElementById("statGrid");
const gapList = document.getElementById("gapList");
const searchBox = document.getElementById("searchBox");

const categories = ["All", ...new Set(ELODIN_DATA.entries.map((entry) => entry.category))];
const evidenceTypes = ["All", ...new Set(ELODIN_DATA.entries.map((entry) => entry.evidence))];

function renderChips(target, items, type) {
  target.innerHTML = "";
  items.forEach((item) => {
    const button = document.createElement("button");
    button.className = `chip ${state[type] === item ? "active" : ""}`;
    button.textContent = item;
    button.addEventListener("click", () => {
      state[type] = item;
      render();
    });
    target.appendChild(button);
  });
}

function matches(entry) {
  const haystack = [
    entry.title,
    entry.category,
    entry.evidence,
    entry.summary,
    entry.implications,
    entry.confidence,
  ]
    .join(" ")
    .toLowerCase();

  const searchMatch = !state.search || haystack.includes(state.search);
  const categoryMatch = state.category === "All" || entry.category === state.category;
  const evidenceMatch = state.evidence === "All" || entry.evidence === state.evidence;
  return searchMatch && categoryMatch && evidenceMatch;
}

function renderStats(filtered) {
  const cards = [
    { label: "Visible Entries", value: filtered.length },
    { label: "Canon", value: filtered.filter((entry) => entry.evidence === "Canon").length },
    { label: "Secondary", value: filtered.filter((entry) => entry.evidence === "Secondary").length },
    { label: "Meta", value: filtered.filter((entry) => entry.evidence === "Meta").length },
    { label: "Theory", value: filtered.filter((entry) => entry.evidence === "Theory").length },
  ];

  statGrid.innerHTML = cards
    .map(
      (card) => `
        <div class="stat-card">
          <strong>${card.value}</strong>
          <span>${card.label}</span>
        </div>
      `,
    )
    .join("");
}

function renderSummaries() {
  summaryGrid.innerHTML = ELODIN_DATA.summaries
    .map(
      (summary) => `
        <article class="summary-card">
          <h3>${summary.title}</h3>
          <p>${summary.text}</p>
        </article>
      `,
    )
    .join("");
}

function renderGaps() {
  gapList.innerHTML = ELODIN_DATA.gaps
    .map(
      (gap) => `
        <article class="note-card">
          <h3>${gap.title}</h3>
          <p>${gap.text}</p>
        </article>
      `,
    )
    .join("");
}

function renderEntries(filtered) {
  if (!filtered.length) {
    entryList.innerHTML = `<div class="empty-state">No entries match that filter combination yet.</div>`;
    return;
  }

  entryList.innerHTML = filtered
    .map(
      (entry) => `
        <article class="entry-card">
          <div class="entry-topline">
            <div>
              <p class="entry-meta">${entry.category}</p>
              <h3>${entry.title}</h3>
            </div>
            <div class="badge-row">
              <span class="badge ${entry.evidence.toLowerCase()}">${entry.evidence}</span>
              <span class="badge">${entry.confidence} confidence</span>
            </div>
          </div>
          <p>${entry.summary}</p>
          <div class="badge-row"><span class="badge">Implication</span></div>
          <p>${entry.implications}</p>
          <div class="source-list">
            ${entry.sources
              .map(
                (source) => `
                  <a class="source-link" href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a>
                  <p>${source.note}</p>
                `,
              )
              .join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

function render() {
  const filtered = ELODIN_DATA.entries.filter(matches);
  renderChips(categoryChips, categories, "category");
  renderChips(evidenceChips, evidenceTypes, "evidence");
  renderStats(filtered);
  renderSummaries();
  renderEntries(filtered);
  renderGaps();
}

searchBox.addEventListener("input", (event) => {
  state.search = event.target.value.trim().toLowerCase();
  render();
});

render();
