# Vault Batch Forwarder

Vault Batch Forwarder is a Manifest V3 Chrome extension for **personal, user-controlled Telegram Web message migration**. It helps you manually batch-select visible messages in a source Telegram Web chat and forward them to a destination chat that you own or are authorized to use.

## Safety and authorization warning

Use this extension **only on your own channels, groups, messages, or content you are explicitly authorized to move**.

Do not use it to bypass Telegram security, forwarding restrictions, private channel restrictions, paywalls, anti-spam systems, or access controls. The extension runs visibly in the active Telegram Web tab, requires a manual Start click, and relies on Telegram Web's normal UI. Telegram may still block or limit forwarding, and you must respect those limits.

## Files

- `manifest.json` — Manifest V3 extension definition for `https://web.telegram.org/*`.
- `popup.html` — Extension popup controls.
- `popup.css` — Popup styling.
- `popup.js` — Popup settings, status rendering, storage, and runtime messaging.
- `content.js` — Telegram Web content script that detects messages, selects batches, forwards, pauses, resumes, stops, and reports status.

## Installation

1. Download or clone this folder.
2. Keep all files together in the `vault-batch-forwarder` folder.
3. Open Chrome and navigate to `chrome://extensions/`.
4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select the `vault-batch-forwarder` folder.
7. Pin the extension if you want quick access from the Chrome toolbar.

## How to use on Telegram Web

1. Open `https://web.telegram.org/` in Chrome.
2. Sign in normally and open the source channel or group that contains your owned or authorized content.
3. Open the Vault Batch Forwarder popup.
4. Enter the destination chat name exactly as it appears, or a name Telegram Web search can find.
5. Choose a conservative batch size and delay.
6. Click **Start**.
7. Keep the Telegram Web tab visible. Do not hide, background, or interfere with the tab while the extension is selecting and forwarding.
8. Use **Pause** before taking manual control of Telegram Web.
9. Use **Resume** to continue.
10. Use **Stop** to halt the run immediately. If Telegram Web has a dialog open, close it manually.

## Safe batch recommendations

- Start with a small test batch of **5–10 messages**.
- Use a delay of at least **15–30 seconds** between batches.
- Keep batch sizes well below the hard maximum of **100** if the messages contain media or if Telegram Web feels slow.
- Stop immediately if Telegram shows a warning, rate limit, permission error, or forwarding restriction.
- Review the destination chat periodically to confirm messages are arriving as expected.

## Known limitations

- Telegram Web's DOM, labels, class names, and forwarding flow can change without notice. If Telegram updates the UI, this extension may fail until selectors or heuristics are updated.
- The extension cannot and will not bypass Telegram forwarding restrictions, private chat restrictions, paywalls, or rate limits.
- Selection behavior differs across Telegram Web variants. Some builds expose checkboxes, some use context menus, and some require manual correction.
- The content script works only in the active Telegram Web tab where you manually start it.
- It forwards visible batches and scrolls to older messages. Infinite history loading, pinned messages, grouped media, protected content, and very large chats may require manual intervention.

## Troubleshooting

- If status reports that no messages are visible, scroll the source chat manually and try again.
- If destination selection fails, check the exact destination name and make sure it appears in Telegram Web search.
- If a Telegram dialog remains open after stopping, close it manually before restarting.
- If Telegram Web changes significantly, inspect the DOM and update the helper functions in `content.js`.
