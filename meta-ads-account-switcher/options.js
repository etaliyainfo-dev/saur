const STORAGE_DEFAULT = {
  accounts: [],
  recentAccountIds: [],
  currentAccountId: "",
  currentOpenedAt: "",
  settings: { openInBackground: true, theme: "light" },
};
const ADS_URL =
  "https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=";
const $ = (id) => document.getElementById(id);
let state = structuredClone(STORAGE_DEFAULT),
  query = "";
async function getStorageData() {
  try {
    const data = {
      ...STORAGE_DEFAULT,
      ...(await chrome.storage.sync.get(STORAGE_DEFAULT)),
    };
    data.settings = { ...STORAGE_DEFAULT.settings, ...(data.settings || {}) };
    data.recentAccountIds = [...new Set(data.recentAccountIds || [])].slice(
      0,
      5,
    );
    return data;
  } catch (e) {
    showMessage("Could not read storage.");
    return structuredClone(STORAGE_DEFAULT);
  }
}
async function saveStorageData(data) {
  try {
    await chrome.storage.sync.set(data);
    return true;
  } catch (e) {
    showMessage("Could not save data. Chrome sync quota may be full.");
    return false;
  }
}
function normalizeAccountId(v) {
  return String(v || "")
    .trim()
    .replace(/^act_/i, "")
    .replace(/\D/g, "");
}
function uuid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function validateAccount(a, existing, editingId) {
  const errors = [];
  if (!a.name.trim()) errors.push("Account name cannot be empty.");
  if (!normalizeAccountId(a.accountId))
    errors.push("Account ID cannot be empty.");
  const clean = normalizeAccountId(a.accountId);
  if (
    clean &&
    existing.some((x) => x.accountId === clean && x.id !== editingId)
  )
    errors.push("This account ID already exists.");
  return errors;
}
function showMessage(t) {
  const el = $("message");
  el.textContent = t;
  el.hidden = false;
  setTimeout(() => (el.hidden = true), 5000);
}
function filteredAccounts() {
  const q = query.toLowerCase();
  return state.accounts
    .filter((a) =>
      [a.name, a.accountId, a.businessName, a.status, a.notes].some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(q),
      ),
    )
    .sort(
      (a, b) => b.isFavorite - a.isFavorite || a.name.localeCompare(b.name),
    );
}
function td(text) {
  const d = document.createElement("td");
  d.textContent = text || "";
  return d;
}
function action(text, cls, fn) {
  const b = document.createElement("button");
  b.className = `tiny ${cls}`;
  b.textContent = text;
  b.type = "button";
  b.onclick = fn;
  return b;
}
function renderAccounts() {
  const body = $("accountsTable");
  body.replaceChildren();
  const accounts = filteredAccounts();
  $("emptyState").hidden = accounts.length > 0;
  if (!accounts.length) return;
  accounts.forEach((a) => {
    const tr = document.createElement("tr");
    const fav = td(a.isFavorite ? "★" : "☆");
    fav.className = "star";
    tr.append(
      fav,
      td(a.name),
      td(a.accountId),
      td(a.businessName),
      td(a.status),
      td(a.updatedAt ? new Date(a.updatedAt).toLocaleDateString() : ""),
    );
    const acts = document.createElement("td");
    acts.className = "actions-cell";
    acts.append(
      action("Open", "success", () => openAdsAccount(a.accountId)),
      action(a.isFavorite ? "Unfavorite" : "Favorite", "secondary", () =>
        toggleFavorite(a.id),
      ),
      action("Edit", "secondary", () => fillForm(a)),
      action("Delete", "danger", () => deleteAccount(a.id)),
    );
    tr.append(acts);
    body.append(tr);
  });
}
async function openAdsAccount(accountId) {
  await chrome.tabs.create({
    url: ADS_URL + accountId,
    active: !state.settings?.openInBackground,
  });
  await updateRecentAccounts(accountId);
}
async function updateRecentAccounts(accountId) {
  state.recentAccountIds = [
    accountId,
    ...(state.recentAccountIds || []).filter((id) => id !== accountId),
  ].slice(0, 5);
  await saveStorageData(state);
}
async function toggleFavorite(id) {
  const a = state.accounts.find((x) => x.id === id);
  if (!a) return;
  a.isFavorite = !a.isFavorite;
  a.updatedAt = new Date().toISOString();
  await saveStorageData(state);
  renderAccounts();
}
function fillForm(a) {
  $("formTitle").textContent = "Edit account";
  $("editingId").value = a.id;
  $("nameInput").value = a.name;
  $("accountIdInput").value = a.accountId;
  $("businessInput").value = a.businessName || "";
  $("statusInput").value = a.status || "";
  $("notesInput").value = a.notes || "";
  $("favoriteInput").checked = !!a.isFavorite;
  scrollTo({ top: 0, behavior: "smooth" });
}
function resetForm() {
  $("accountForm").reset();
  $("editingId").value = "";
  $("formTitle").textContent = "Add account";
  $("formError").hidden = true;
}
async function deleteAccount(id) {
  const a = state.accounts.find((x) => x.id === id);
  if (!a || !confirm(`Delete ${a.name}?`)) return;
  state.accounts = state.accounts.filter((x) => x.id !== id);
  state.recentAccountIds = (state.recentAccountIds || [])
    .filter((x) => x !== a.accountId)
    .slice(0, 5);
  await saveStorageData(state);
  renderAccounts();
  resetForm();
}
function parseCSV(text) {
  const rows = [];
  let row = [],
    cur = "",
    q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i],
      n = text[i + 1];
    if (c === '"' && q && n === '"') {
      cur += '"';
      i++;
    } else if (c === '"') q = !q;
    else if (c === "," && !q) {
      row.push(cur);
      cur = "";
    } else if ((c === "\n" || c === "\r") && !q) {
      if (c === "\r" && n === "\n") i++;
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else cur += c;
  }
  row.push(cur);
  rows.push(row);
  return rows;
}
function importCSV(text) {
  const rows = parseCSV(text);
  let added = 0,
    dupes = 0,
    invalid = 0;
  const header = (rows[0] || []).map((x) => x.trim());
  const start = header[0]?.toLowerCase() === "name" ? 1 : 0;
  for (const r of rows.slice(start)) {
    if (r.every((v) => !String(v || "").trim())) continue;
    const [name, accountId, businessName, status, notes, isFavorite] = r;
    const clean = normalizeAccountId(accountId);
    if (!name?.trim() || !clean) {
      invalid++;
      continue;
    }
    if (state.accounts.some((a) => a.accountId === clean)) {
      dupes++;
      continue;
    }
    const now = new Date().toISOString();
    state.accounts.push({
      id: uuid(),
      name: name.trim(),
      accountId: clean,
      businessName: (businessName || "").trim(),
      status: (status || "").trim(),
      notes: (notes || "").trim(),
      isFavorite: /^(true|1|yes|y)$/i.test(String(isFavorite || "").trim()),
      createdAt: now,
      updatedAt: now,
    });
    added++;
  }
  return { added, skippedDuplicates: dupes, invalidRows: invalid };
}
function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function download(name, type, text) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
function exportCSV() {
  const head = [
    "name",
    "accountId",
    "businessName",
    "status",
    "notes",
    "isFavorite",
  ];
  const lines = [
    head.join(","),
    ...state.accounts.map((a) => head.map((k) => csvEscape(a[k])).join(",")),
  ];
  download("meta-ads-accounts.csv", "text/csv", lines.join("\n"));
}
function exportJSON() {
  download(
    "meta-ads-accounts.json",
    "application/json",
    JSON.stringify(state, null, 2),
  );
}
$("accountForm").onsubmit = async (e) => {
  e.preventDefault();
  const editingId = $("editingId").value;
  const data = {
    name: $("nameInput").value.trim(),
    accountId: normalizeAccountId($("accountIdInput").value),
    businessName: $("businessInput").value.trim(),
    status: $("statusInput").value.trim(),
    notes: $("notesInput").value.trim(),
    isFavorite: $("favoriteInput").checked,
  };
  const errors = validateAccount(data, state.accounts, editingId);
  if (errors.length) {
    $("formError").textContent = errors[0];
    $("formError").hidden = false;
    return;
  }
  const now = new Date().toISOString();
  if (editingId)
    Object.assign(
      state.accounts.find((a) => a.id === editingId),
      data,
      { updatedAt: now },
    );
  else
    state.accounts.push({
      ...data,
      id: uuid(),
      createdAt: now,
      updatedAt: now,
    });
  await saveStorageData(state);
  resetForm();
  renderAccounts();
};
$("resetFormBtn").onclick = resetForm;
$("searchInput").oninput = (e) => {
  query = e.target.value;
  renderAccounts();
};
$("exportCsvBtn").onclick = exportCSV;
$("exportJsonBtn").onclick = exportJSON;
$("importCsvBtn").onclick = () => {
  const f = $("csvFileInput").files[0];
  if (!f) {
    showMessage("Choose a CSV file first.");
    return;
  }
  const reader = new FileReader();
  reader.onerror = () => showMessage("Could not read import file.");
  reader.onload = async () => {
    const s = importCSV(String(reader.result || ""));
    await saveStorageData(state);
    $("importSummary").textContent =
      `Added: ${s.added}\nSkipped duplicates: ${s.skippedDuplicates}\nInvalid rows: ${s.invalidRows}`;
    $("importSummary").hidden = false;
    renderAccounts();
  };
  reader.readAsText(f);
};
$("clearAllBtn").onclick = async () => {
  if (confirm("Clear all accounts and recent history?")) {
    state = {
      ...structuredClone(STORAGE_DEFAULT),
      settings: { ...state.settings },
    };
    await saveStorageData(state);
    renderAccounts();
    resetForm();
  }
};
getStorageData().then((d) => {
  state = d;
  renderAccounts();
});
