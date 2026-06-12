(() => {
  const MAX_BATCH_SIZE = 100;
  const MESSAGE_SELECTOR = [
    "[data-message-id]",
    ".message",
    ".Message",
    "[class*='message']"
  ].join(",");

  const state = {
    running: false,
    paused: false,
    stopped: true,
    selectedCount: 0,
    currentBatch: 0,
    errors: 0,
    message: "Ready. Start from the extension popup when your source chat is open.",
    settings: {
      batchSize: 50,
      delaySeconds: 15,
      destination: ""
    },
    observer: null,
    overlay: null
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function randomDelay(baseSeconds) {
    const baseMs = Math.max(1000, Number(baseSeconds) * 1000 || 15000);
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
      updateStatus("Paused. Click Resume to continue.");
      await sleep(400);
    }
    ensureNotStopped();
  }

  function isVisible(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
  }

  function getVisibleMessages() {
    const candidates = Array.from(document.querySelectorAll(MESSAGE_SELECTOR))
      .filter((element) => isVisible(element))
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const hasText = (element.innerText || element.textContent || "").trim().length > 0;
        return hasText && rect.bottom > 80 && rect.top < window.innerHeight - 80;
      });

    const unique = [...new Set(candidates.map((element) => element.closest("[data-message-id], .message, .Message") || element))];
    return unique.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
  }

  function normalizeText(value) {
    return (value || "").replace(/\s+/g, " ").trim().toLowerCase();
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
    const selectAction = findClickableByText(["select", "select message"]);
    if (selectAction) {
      clickElement(selectAction);
      await sleep(250);
      return true;
    }

    // Some Telegram Web builds support modifier-click multi-select once selection mode is active.
    message.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window, ctrlKey: true, metaKey: true }));
    await sleep(250);
    return true;
  }

  async function clickForward() {
    await waitWhilePaused();
    const forwardButton = await waitForElement(() => findClickableByText(["forward"]), { timeout: 8000 });
    clickElement(forwardButton);
    await sleep(700);
  }

  function setNativeValue(element, value) {
    const prototype = element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : element instanceof HTMLInputElement
        ? HTMLInputElement.prototype
        : HTMLElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");

    if (descriptor?.set && "value" in element) {
      descriptor.set.call(element, value);
    } else if (element.isContentEditable) {
      element.textContent = value;
    } else {
      element.value = value;
    }

    element.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: value }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  async function chooseDestination(destination) {
    await waitWhilePaused();
    if (!destination) throw new Error("Destination chat name is required.");

    const searchInput = await waitForElement(() => {
      const fields = Array.from(document.querySelectorAll("input[type='text'], input[placeholder], [contenteditable='true'], textarea"))
        .filter(isVisible);
      return fields.find((field) => normalizeText(field.getAttribute("placeholder") || field.getAttribute("aria-label") || "").includes("search")) || fields[0];
    }, { timeout: 10000 });

    searchInput.focus();
    setNativeValue(searchInput, destination);
    await sleep(1200);

    const destinationNode = await waitForElement(() => {
      const destinationText = normalizeText(destination);
      return Array.from(document.querySelectorAll("[role='button'], .ListItem, [class*='chat'], [class*='Chat'], li, a"))
        .filter(isVisible)
        .find((element) => normalizeText(element.innerText || element.textContent).includes(destinationText));
    }, { timeout: 10000 });

    clickElement(destinationNode);
    await sleep(700);
  }

  async function confirmForward() {
    await waitWhilePaused();
    const sendButton = await waitForElement(() => findClickableByText(["send", "forward"]), { timeout: 10000 });
    clickElement(sendButton);
    await sleep(1000);
  }

  async function scrollToOlderMessages() {
    await waitWhilePaused();
    const before = getVisibleMessages()[0]?.getBoundingClientRect().top || 0;
    const scrollContainers = Array.from(document.querySelectorAll(".scrollable, [class*='scroll'], [class*='Scroll'], main, section"))
      .filter((element) => isVisible(element) && element.scrollHeight > element.clientHeight);
    const container = scrollContainers.sort((a, b) => b.clientHeight - a.clientHeight)[0] || document.scrollingElement || document.documentElement;

    container.scrollBy({ top: -Math.max(500, window.innerHeight * 0.75), behavior: "smooth" });
    await sleep(1200);

    if ((getVisibleMessages()[0]?.getBoundingClientRect().top || 0) === before) {
      window.scrollBy({ top: -Math.max(500, window.innerHeight * 0.75), behavior: "smooth" });
      await sleep(800);
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
      "max-width: 360px",
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
      if (state.running && !state.paused) {
        const count = getVisibleMessages().length;
        if (count) updateStatus(`Detected ${count} visible messages.`);
      }
    });
    state.observer.observe(document.body, { childList: true, subtree: true });
  }

  function resetRun(settings) {
    state.settings = {
      batchSize: Math.min(MAX_BATCH_SIZE, Math.max(1, Number(settings.batchSize) || 50)),
      delaySeconds: Math.max(1, Number(settings.delaySeconds) || 15),
      destination: String(settings.destination || "").trim()
    };
    state.running = true;
    state.paused = false;
    state.stopped = false;
    state.selectedCount = 0;
    state.currentBatch = 0;
    state.errors = 0;
    startObserver();
    updateStatus("Starting. Keep this tab visible and do not interact until paused or stopped.");
  }

  async function runBatchForwarder(settings) {
    resetRun(settings);

    try {
      while (!state.stopped) {
        await waitWhilePaused();
        state.currentBatch += 1;
        updateStatus("Collecting visible messages for the next batch.");

        const batch = getVisibleMessages().slice(0, state.settings.batchSize);
        if (!batch.length) {
          updateStatus("No visible messages found. Scrolling to older messages.");
          await scrollToOlderMessages();
          if (!getVisibleMessages().length) break;
          continue;
        }

        for (const message of batch) {
          await selectMessage(message);
          state.selectedCount += 1;
          updateStatus(`Selected ${state.selectedCount} messages so far.`);
        }

        updateStatus("Opening Telegram forward dialog.");
        await clickForward();
        updateStatus(`Choosing destination: ${state.settings.destination}`);
        await chooseDestination(state.settings.destination);
        updateStatus("Confirming forward. Telegram may still enforce its own restrictions.");
        await confirmForward();

        const delay = randomDelay(state.settings.delaySeconds);
        updateStatus(`Batch ${state.currentBatch} complete. Waiting ${Math.round(delay / 1000)} seconds before scrolling.`);
        await sleep(delay);
        await scrollToOlderMessages();
      }

      state.running = false;
      state.stopped = true;
      updateStatus("Finished or stopped. Review Telegram Web for any messages that require manual handling.");
    } catch (error) {
      state.errors += 1;
      state.running = false;
      state.stopped = true;
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
        updateStatus("Resumed by user.");
      } else if (message.type === "vault:stop") {
        state.stopped = true;
        state.paused = false;
        state.running = false;
        updateStatus("Stopped by user. Any open Telegram dialog may need to be closed manually.");
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
