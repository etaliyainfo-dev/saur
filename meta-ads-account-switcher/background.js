chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "open-switcher") return;
  try {
    if (chrome.action && chrome.action.openPopup) {
      await chrome.action.openPopup();
      return;
    }
  } catch (error) {
    console.warn(
      "Popup could not be opened, falling back to options page.",
      error,
    );
  }
  try {
    chrome.runtime.openOptionsPage();
  } catch (error) {
    chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
  }
});
