(() => {
  const MAX_BATCH_SIZE = 100;
  const DEFAULT_BATCH_SIZE = 20;
  const DEFAULT_DELAY_SECONDS = 15;
  const MANUAL_FORWARD_MESSAGE = "Manual action required: click Forward, choose destination, then click Resume.";
  const PROGRESS_KEY = "vaultBatchForwarderProgress";
  const MESSAGE_SELECTOR = [
    "[data-message-id]",
    "[data-mid]",
    ".message",
    ".Message",
    "[class*='message']"
  ].join(",");
  const EXCLUDED_MESSAGE_SELECTOR = [
    "[class*='pinned']",
    "[class*='Pinned']",
    "[class*='date']",
    "[class*='Date']",
    "[class*='service']",
    "[class*='Service']",
    "[class*='sidebar']",
    "[class*='Sidebar']",
    "[role='navigation'] *",
    "aside *",
    "nav *"
  ].join(",");

  const state = {
    running: false,
    paused: false,
    stopped: true,
    awaitingManualForward: false,
    selectedCount: 0,
    currentBatch: 0,
    errors: 0,
    processedMessageKeys: new Set(),
    lastSelectedKey: null,
    message: "Ready. Start from the extension popup when your source chat is open.",
    settings: {
      batchSize: DEFAULT_BATCH_SIZE,
      delaySeconds: DEFAULT_DELAY_SECONDS,
      destination: ""
    },
    observer: null,
    overlay: null
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function randomDelay(baseSeconds) {
    const baseMs = Math.max(1000, Number(baseSeconds) * 1000 || DEFAULT_DELAY_SECONDS * 1000);
    const jitter = baseMs * (0.2 + Math.random() * 0.3);
    return Math.round(baseMs + jitter);
  }

  async function waitForElement(selectorOrPredicate, { timeout = 10000, root = document, interval = 250 } = {}) {
    const started = Date.now();

    while (Date.now() - started < timeout) {
      ensureNotStopped();
      const element = typeof selectorOrPredicate === "function"
        ? selectorOrPredicate(root)
        : root.querySelector(selectorOrPredicate);
      if (element) return element;
      await sleep(interval);
    }

    throw new Error(`Timed out waiting for ${typeof selectorOrPredicate === "string" ? selectorOrPredicate : "element"}`);
  }

  function ensureNotStopped() {
    if (state.stopped) {
      throw new Error("Stopped by user.");
    }
  }

  async function waitWhilePaused() {
    while (state.paused && !state.stopped) {
      updateStatus(state.awaitingManualForward ? MANUAL_FORWARD_MESSAGE : "Paused. Click Resume to continue.");
      await sleep(500);
    }
    ensureNotStopped();
  }

  function normalizeText(value) {
    return (value || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function isVisible(element) {
    if (!element || !(element instanceof Element)) return false;
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
  }

  function getScrollableContainers() {
    return Array.from(document.querySelectorAll(".scrollable, [class*='scroll'], [class*='Scroll'], [class*='messages'], [class*='Messages'], main, section"))
      .filter((element) => isVisible(element) && element.scrollHeight > element.clientHeight + 20)
      .sort((a, b) => b.clientHeight - a.clientHeight);
  }

  function getChatScroller() {
    const visibleMessages = getVisibleMessages({ includeProcessed: true });
    const containers = getScrollableContainers();
    const messageContainer = containers.find((container) => visibleMessages.some((message) => container.contains(message)));
    return messageContainer || containers[0] || document.scrollingElement || document.documentElement;
  }

  function getMessageKey(message) {
    const explicitId = message.getAttribute("data-message-id") || message.getAttribute("data-mid") || message.id;
    if (explicitId) return `id:${explicitId}`;

    const text = normalizeText(message.innerText || message.textContent).slice(0, 140);
    const rect = message.getBoundingClientRect();
    return `fallback:${text}:${Math.round(rect.height)}:${Math.round(rect.width)}`;
  }

  function isSelectableChatMessage(element) {
    if (!isVisible(element)) return false;
    if (element.matches(EXCLUDED_MESSAGE_SELECTOR) || element.closest(EXCLUDED_MESSAGE_SELECTOR)) return false;
    if (element.closest("[role='navigation'], aside, nav")) return false;

    const text = normalizeText(element.innerText || element.textContent);
    if (!text) return false;
    if (/^(today|yesterday|mon|tue|wed|thu|fri|sat|sun|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}\/\d{1,2}\/\d{2,4})$/i.test(text)) return false;
    if (text.includes("pinned message") || text.includes("joined telegram") || text.includes("created the group")) return false;

    const rect = element.getBoundingClientRect();
    return rect.bottom > 70 && rect.top < window.innerHeight - 40;
  }

  function getVisibleMessages({ includeProcessed = false } = {}) {
    const candidates = Array.from(document.querySelectorAll(MESSAGE_SELECTOR))
      .map((element) => element.closest("[data-message-id], [data-mid], .message, .Message") || element)
      .filter(isSelectableChatMessage);

    const unique = [...new Set(candidates)];
    return unique
      .filter((message) => includeProcessed || !state.processedMessageKeys.has(getMessageKey(message)))
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
  }

  function getOldestVisibleMessages() {
    return getVisibleMessages().sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
  }

  async function waitForMessagesToLoad({ previousCount = 0, timeout = 4500, stableChecks = 3 } = {}) {
    let lastCount = previousCount;
    let stableCount = 0;
    const started = Date.now();

    while (Date.now() - started < timeout) {
      await waitWhilePaused();
      const currentCount = getVisibleMessages({ includeProcessed: true }).length;
      if (currentCount !== lastCount) {
        lastCount = currentCount;
        stableCount = 0;
      } else {
        stableCount += 1;
      }
      if (stableCount >= stableChecks) return currentCount;
      await sleep(500);
    }

    return getVisibleMessages({ includeProcessed: true }).length;
  }

  function detectTopReached({ previousCount = 0, currentCount = 0, unchangedAttempts = 0 } = {}) {
    const scroller = getChatScroller();
    const scrollTop = Math.abs(Math.round(scroller.scrollTop || 0));
    return scrollTop === 0 || (unchangedAttempts >= 3 && currentCount <= previousCount);
  }

  async function scrollToOldestMessage() {
    updateStatus("Scrolling to the oldest message before selecting anything.");
    let unchangedAttempts = 0;
    let previousCount = getVisibleMessages({ includeProcessed: true }).length;

    for (let attempt = 1; attempt <= 80; attempt += 1) {
      await waitWhilePaused();
      const scroller = getChatScroller();
      const beforeTop = Math.round(scroller.scrollTop || 0);
      scroller.scrollTo({ top: 0, behavior: "auto" });
      if (scroller !== document.scrollingElement && scroller !== document.documentElement) {
        scroller.scrollBy({ top: -Math.max(700, scroller.clientHeight * 0.9), behavior: "auto" });
      }
      window.scrollTo({ top: 0, behavior: "auto" });

      const currentCount = await waitForMessagesToLoad({ previousCount });
      const afterTop = Math.round(scroller.scrollTop || 0);
      unchangedAttempts = currentCount <= previousCount && beforeTop === afterTop ? unchangedAttempts + 1 : 0;
      updateStatus(`Loading older messages... attempt ${attempt}, visible messages ${currentCount}.`);

      if (detectTopReached({ previousCount, currentCount, unchangedAttempts })) {
        updateStatus("Oldest loaded message reached. Selection will start oldest to newest.");
        return;
      }

      previousCount = currentCount;
      await sleep(300);
    }

    updateStatus("Stopped scrolling after many attempts. Starting from the oldest currently loaded message.");
  }

  function findClickableByText(words) {
    const normalizedWords = words.map(normalizeText);
    const selectors = ["button", "[role='button']", "[aria-label]", "[title]", ".MenuItem", "[class*='menu'] div"];
    return Array.from(document.querySelectorAll(selectors.join(",")))
      .filter(isVisible)
      .find((element) => {
        const label = normalizeText([
          element.innerText,
          element.getAttribute("aria-label"),
          element.getAttribute("title")
        ].filter(Boolean).join(" "));
        return normalizedWords.some((word) => label.includes(word));
      });
  }

  function clickElement(element) {
    element.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, cancelable: true, view: window }));
    element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true, view: window }));
    element.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true, view: window }));
    element.click();
  }

  async function openMessageMenu(message) {
    message.scrollIntoView({ block: "center", behavior: "smooth" });
    await sleep(300);
    message.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, view: window }));
    await sleep(350);
  }

  async function selectMessage(message) {
    await waitWhilePaused();

    const checkbox = message.querySelector("input[type='checkbox'], [role='checkbox'], .Checkbox, [class*='checkbox']");
    if (checkbox && isVisible(checkbox)) {
      clickElement(checkbox);
      await sleep(150);
      return true;
    }

    await openMessageMenu(message);
    const selectAction = findClickableByText(["select message", "select"]);
    if (selectAction) {
      clickElement(selectAction);
      await sleep(250);
      return true;
    }

    message.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window, ctrlKey: true, metaKey: true }));
    await sleep(250);
    return true;
  }

  async function selectOldestToNewestBatch() {
    const batch = getOldestVisibleMessages().slice(0, state.settings.batchSize);
    if (!batch.length) return [];

    for (const message of batch) {
      await selectMessage(message);
      const key = getMessageKey(message);
      state.processedMessageKeys.add(key);
      state.lastSelectedKey = key;
      state.selectedCount += 1;
      updateStatus(`Selected ${state.selectedCount} messages total, oldest to newest.`);
      await saveProgress();
    }

    return batch;
  }

  async function clickForward() {
    await waitWhilePaused();
    const forwardButton = findClickableByText(["forward"]);
    if (!forwardButton) return false;
    clickElement(forwardButton);
    await sleep(700);
    return true;
  }

  async function chooseDestination() {
    updateStatus("Manual destination mode is enabled. Choose the destination in Telegram Web yourself.");
    return false;
  }

  async function confirmForward() {
    updateStatus("Manual destination mode is enabled. Confirm the forward in Telegram Web yourself.");
    return false;
  }

  async function scrollToOlderMessages() {
    await scrollToOldestMessage();
  }

  async function scrollToNextNewerMessages() {
    await waitWhilePaused();
    const scroller = getChatScroller();
    const beforeTop = Math.round(scroller.scrollTop || 0);
    const beforeFirstMessage = getVisibleMessages({ includeProcessed: true })[0];
    const beforeFirstKey = beforeFirstMessage ? getMessageKey(beforeFirstMessage) : "";
    const amount = Math.max(650, (scroller.clientHeight || window.innerHeight) * 0.75);
    scroller.scrollBy({ top: amount, behavior: "smooth" });
    await waitForMessagesToLoad({ previousCount: getVisibleMessages({ includeProcessed: true }).length, timeout: 2200, stableChecks: 2 });

    const afterTop = Math.round(scroller.scrollTop || 0);
    const afterFirstMessage = getVisibleMessages({ includeProcessed: true })[0];
    const afterFirstKey = afterFirstMessage ? getMessageKey(afterFirstMessage) : "";
    return beforeTop !== afterTop || beforeFirstKey !== afterFirstKey;
  }

  async function saveProgress() {
    const progress = {
      selectedCount: state.selectedCount,
      currentBatch: state.currentBatch,
      lastSelectedKey: state.lastSelectedKey,
      processedMessageKeys: Array.from(state.processedMessageKeys),
      savedAt: Date.now()
    };
    await chrome.storage.local.set({ [PROGRESS_KEY]: progress });
  }

  async function resumeFromLastSelected() {
    const { [PROGRESS_KEY]: progress = {} } = await chrome.storage.local.get(PROGRESS_KEY);
    state.selectedCount = progress.selectedCount || state.selectedCount;
    state.currentBatch = progress.currentBatch || state.currentBatch;
    state.lastSelectedKey = progress.lastSelectedKey || state.lastSelectedKey;
    state.processedMessageKeys = new Set(progress.processedMessageKeys || Array.from(state.processedMessageKeys));

    const visibleUnprocessed = getOldestVisibleMessages();
    if (!visibleUnprocessed.length) {
      updateStatus("No unprocessed visible messages remain. Scrolling to the next newer messages.");
      await scrollToNextNewerMessages();
    } else {
      visibleUnprocessed[0].scrollIntoView({ block: "center", behavior: "smooth" });
      await sleep(350);
    }
  }

  function createOverlay() {
    if (state.overlay) return state.overlay;

    const overlay = document.createElement("div");
    overlay.id = "vault-batch-forwarder-status";
    overlay.setAttribute("role", "status");
    overlay.style.cssText = [
      "position: fixed",
      "right: 16px",
      "bottom: 16px",
      "z-index: 2147483647",
      "max-width: 420px",
      "padding: 12px 14px",
      "border-radius: 12px",
      "background: rgba(17, 24, 39, 0.94)",
      "color: white",
      "font: 13px/1.4 system-ui, sans-serif",
      "box-shadow: 0 12px 30px rgba(0,0,0,.28)",
      "pointer-events: none"
    ].join(";");
    document.documentElement.appendChild(overlay);
    state.overlay = overlay;
    return overlay;
  }

  function updateStatus(message = state.message) {
    state.message = message;
    const status = {
      state: state.stopped ? "Stopped" : state.paused ? "Paused" : state.running ? "Running" : "Idle",
      selectedCount: state.selectedCount,
      currentBatch: state.currentBatch,
      errors: state.errors,
      message
    };

    chrome.storage.local.set({ status });
    chrome.runtime.sendMessage({ type: "vault:status", status }).catch(() => undefined);

    const overlay = createOverlay();
    overlay.textContent = `Vault Batch Forwarder: ${status.state} | Selected ${status.selectedCount} | Batch ${status.currentBatch} | Errors ${status.errors} — ${message}`;
  }

  function startObserver() {
    if (state.observer) return;
    state.observer = new MutationObserver(() => {
      if (state.running && !state.paused && !state.awaitingManualForward) {
        const count = getVisibleMessages({ includeProcessed: true }).length;
        if (count) updateStatus(`Detected ${count} visible selectable messages.`);
      }
    });
    state.observer.observe(document.body, { childList: true, subtree: true });
  }

  async function resetRun(settings) {
    state.settings = {
      batchSize: Math.min(MAX_BATCH_SIZE, Math.max(1, Number(settings.batchSize) || DEFAULT_BATCH_SIZE)),
      delaySeconds: Math.max(1, Number(settings.delaySeconds) || DEFAULT_DELAY_SECONDS),
      destination: String(settings.destination || "").trim()
    };
    state.running = true;
    state.paused = false;
    state.stopped = false;
    state.awaitingManualForward = false;
    state.selectedCount = 0;
    state.currentBatch = 0;
    state.errors = 0;
    state.processedMessageKeys = new Set();
    state.lastSelectedKey = null;
    await chrome.storage.local.remove(PROGRESS_KEY);
    startObserver();
    updateStatus("Starting. The extension will scroll to the oldest message first.");
  }

  async function pauseForManualForward() {
    state.awaitingManualForward = true;
    state.paused = true;
    await saveProgress();
    updateStatus(MANUAL_FORWARD_MESSAGE);
  }

  async function runBatchForwarder(settings) {
    await resetRun(settings);

    try {
      await scrollToOldestMessage();

      while (!state.stopped) {
        await waitWhilePaused();
        await resumeFromLastSelected();
        state.currentBatch += 1;
        await saveProgress();
        updateStatus(`Selecting batch ${state.currentBatch} from oldest to newest.`);

        let batch = await selectOldestToNewestBatch();
        let noBatchScrollAttempts = 0;
        while (!batch.length && !state.stopped) {
          const moved = await scrollToNextNewerMessages();
          noBatchScrollAttempts = moved ? 0 : noBatchScrollAttempts + 1;
          batch = await selectOldestToNewestBatch();
          if (!batch.length && noBatchScrollAttempts >= 3) break;
        }

        if (!batch.length) {
          state.running = false;
          state.stopped = true;
          updateStatus("No more selectable messages were found. Finished.");
          break;
        }

        const openedForward = await clickForward();
        if (openedForward) {
          await chooseDestination();
          await confirmForward();
          await pauseForManualForward();
        } else {
          await pauseForManualForward();
        }

        await waitWhilePaused();
        state.awaitingManualForward = false;
        updateStatus(`Forward confirmed manually. Waiting before batch ${state.currentBatch + 1}.`);
        await sleep(randomDelay(state.settings.delaySeconds));
        await resumeFromLastSelected();
      }
    } catch (error) {
      state.errors += 1;
      state.running = false;
      state.stopped = true;
      state.awaitingManualForward = false;
      updateStatus(`Error: ${error.message}. Telegram Web UI may have changed or requires manual action.`);
    }
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message?.type?.startsWith("vault:")) return false;

    try {
      if (message.type === "vault:start") {
        if (state.running && !state.stopped) throw new Error("A forwarding run is already active.");
        runBatchForwarder(message.settings || {});
      } else if (message.type === "vault:pause") {
        state.paused = true;
        updateStatus("Paused by user.");
      } else if (message.type === "vault:resume") {
        state.paused = false;
        state.running = true;
        updateStatus(state.awaitingManualForward ? "Resumed after manual forward." : "Resumed by user.");
      } else if (message.type === "vault:stop") {
        state.stopped = true;
        state.paused = false;
        state.running = false;
        state.awaitingManualForward = false;
        updateStatus("Stopped by user. Any selected Telegram messages may need to be cleared manually.");
      }
      sendResponse({ ok: true });
    } catch (error) {
      state.errors += 1;
      updateStatus(error.message);
      sendResponse({ ok: false, error: error.message });
    }

    return true;
  });

  updateStatus("Ready. Use only for owned or authorized content and respect Telegram limits.");
})();
