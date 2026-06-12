# Vault Batch Forwarder

Vault Batch Forwarder is a Manifest V3 Chrome extension for **personal, user-controlled Telegram Web message migration**. It scrolls upward until Telegram stops loading older messages, starts from the first/oldest message it can reach in the current Telegram Web chat, selects messages oldest-to-newest in user-sized batches, and pauses so you can manually forward each batch to a destination chat that you own or are authorized to use.

## Safety and authorization warning

Use this extension **only on your own channels, groups, messages, or content you are explicitly authorized to move**.

Do not use it to bypass Telegram security, forwarding restrictions, private channel restrictions, paywalls, anti-spam systems, or access controls. The extension runs visibly in the active Telegram Web tab, requires a manual Start click, and relies on Telegram Web's normal UI. Telegram may still block or limit forwarding, and you must respect those limits.

## Files

- `manifest.json` — Manifest V3 extension definition for `https://web.telegram.org/*`.
- `popup.html` — Extension popup controls.
- `popup.css` — Popup styling.
- `popup.js` — Popup settings, status rendering, storage, and runtime messaging.
- `content.js` — Telegram Web content script that scrolls to the oldest message, detects selectable chat messages, selects oldest-to-newest batches, opens Forward when possible, pauses for manual destination forwarding, resumes, stops, saves progress, and reports status.

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
4. Optionally enter a destination note for your reference. Destination selection stays manual inside Telegram Web.
5. Choose a conservative batch size and delay. The default batch size is **20** and the maximum is **100**.
6. Click **Start**. The extension will scroll upward until it detects the oldest loaded message before selecting anything.
7. Wait while older messages load. The extension starts selecting only after it reaches the beginning/oldest message area.
8. After a batch is selected, the extension tries to open Telegram's Forward dialog. If it cannot find the Forward button, it keeps messages selected and shows: `Manual action required: click Forward, choose destination, then click Resume.`
9. Choose the destination group/channel manually in Telegram Web, complete the forward, then click **Resume** in the extension popup.
10. The extension continues from the last selected message and selects the next oldest-to-newest batch.
11. Use **Pause** before taking manual control of Telegram Web outside the manual-forward step.
12. Use **Stop** to halt the run immediately. If Telegram Web has selected messages or a dialog open, clear/close them manually.

## Safe batch recommendations

- Start with the default batch size of **20**, or use a smaller test batch of **5–10 messages** first.
- Use the default **15 seconds** delay or a longer **15–30 seconds** delay between batches.
- Keep batch sizes well below the hard maximum of **100** if the messages contain media or if Telegram Web feels slow.
- Stop immediately if Telegram shows a warning, rate limit, permission error, or forwarding restriction.
- Review the destination chat periodically to confirm messages are arriving as expected.

## Known limitations

- Telegram Web's DOM, labels, class names, and forwarding flow can change without notice. If Telegram updates the UI, this extension may fail until selectors or heuristics are updated.
- The extension cannot and will not bypass Telegram forwarding restrictions, private chat restrictions, paywalls, or rate limits.
- Selection behavior differs across Telegram Web variants. Some builds expose checkboxes, some use context menus, and some require manual correction.
- The content script works only in the active Telegram Web tab where you manually start it.
- It intentionally skips likely pinned messages, date separators, service messages, sidebars, and non-message UI, but Telegram DOM changes can still require manual review.
- It scrolls to the oldest message before starting, then moves forward through history. Infinite history loading, grouped media, protected content, and very large chats may require manual intervention.

## Troubleshooting

- If status reports that no messages are visible, scroll the source chat manually and try again.
- If the Forward button is not detected, click Forward manually, choose the destination, complete the forward, then click **Resume**.
- If a Telegram dialog remains open after stopping, close it manually before restarting.
- If Telegram Web changes significantly, inspect the DOM and update the helper functions in `content.js`.
