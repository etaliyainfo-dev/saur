const DEFAULT_SETTINGS = {
  batchSize: 50,
  delaySeconds: 15,
  destination: ""
};

const elements = {
  form: document.querySelector("#settings-form"),
  destination: document.querySelector("#destination"),
  batchSize: document.querySelector("#batch-size"),
  delaySeconds: document.querySelector("#delay-seconds"),
  start: document.querySelector("#start"),
  pause: document.querySelector("#pause"),
  resume: document.querySelector("#resume"),
  stop: document.querySelector("#stop"),
  state: document.querySelector("#state"),
  selectedCount: document.querySelector("#selected-count"),
  currentBatch: document.querySelector("#current-batch"),
  errors: document.querySelector("#errors"),
  message: document.querySelector("#message")
};

function normalizeSettings() {
  const batchSize = Math.min(100, Math.max(1, Number(elements.batchSize.value) || DEFAULT_SETTINGS.batchSize));
  const delaySeconds = Math.max(1, Number(elements.delaySeconds.value) || DEFAULT_SETTINGS.delaySeconds);
  const destination = elements.destination.value.trim();

  elements.batchSize.value = String(batchSize);
  elements.delaySeconds.value = String(delaySeconds);

  return { batchSize, delaySeconds, destination };
}

async function saveSettings() {
  const settings = normalizeSettings();
  await chrome.storage.local.set({ settings });
  return settings;
}

async function loadSettings() {
  const { settings = DEFAULT_SETTINGS, status = {} } = await chrome.storage.local.get(["settings", "status"]);

  elements.destination.value = settings.destination || DEFAULT_SETTINGS.destination;
  elements.batchSize.value = settings.batchSize || DEFAULT_SETTINGS.batchSize;
  elements.delaySeconds.value = settings.delaySeconds || DEFAULT_SETTINGS.delaySeconds;
  renderStatus(status);
}

function renderStatus(status = {}) {
  elements.state.textContent = status.state || "Idle";
  elements.selectedCount.textContent = String(status.selectedCount || 0);
  elements.currentBatch.textContent = String(status.currentBatch || 0);
  elements.errors.textContent = String(status.errors || 0);
  elements.message.textContent = status.message || "Open Telegram Web, choose a source chat, then click Start.";

  const running = status.state === "Running";
  const paused = status.state === "Paused";
  elements.pause.disabled = !running;
  elements.resume.disabled = !paused;
  elements.stop.disabled = !(running || paused);
}

async function getTelegramTab() {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!activeTab?.id || !activeTab.url?.startsWith("https://web.telegram.org/")) {
    throw new Error("Open https://web.telegram.org/ in the active tab before using this extension.");
  }
  return activeTab;
}

async function sendCommand(command, payload = {}) {
  const tab = await getTelegramTab();
  const response = await chrome.tabs.sendMessage(tab.id, { type: `vault:${command}`, ...payload });
  if (!response?.ok) {
    throw new Error(response?.error || "Telegram Web content script did not respond.");
  }
  return response;
}

async function handleCommand(command) {
  try {
    let payload = {};
    if (command === "start") {
      if (!elements.form.reportValidity()) return;
      payload.settings = await saveSettings();
    }
    await sendCommand(command, payload);
  } catch (error) {
    renderStatus({
      state: "Error",
      selectedCount: Number(elements.selectedCount.textContent) || 0,
      currentBatch: Number(elements.currentBatch.textContent) || 0,
      errors: (Number(elements.errors.textContent) || 0) + 1,
      message: error.message
    });
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "vault:status") {
    renderStatus(message.status);
  }
});

elements.form.addEventListener("change", saveSettings);
elements.form.addEventListener("input", () => {
  normalizeSettings();
});
elements.start.addEventListener("click", () => handleCommand("start"));
elements.pause.addEventListener("click", () => handleCommand("pause"));
elements.resume.addEventListener("click", () => handleCommand("resume"));
elements.stop.addEventListener("click", () => handleCommand("stop"));

loadSettings();
