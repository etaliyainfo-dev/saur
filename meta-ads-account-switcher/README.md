# Meta Ads Account Switcher

A production-ready Chrome/Edge Manifest V3 extension for saving, searching, favoriting, importing/exporting, and opening Meta/Facebook Ads accounts directly in Ads Manager.

## What it does

- Saves ad account names, numeric account IDs, optional business names, status labels, notes, and favorites in `chrome.storage.sync`.
- Opens accounts in a new tab using:
  `https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=ACCOUNT_ID`
- Shows favorites, the last 5 recent accounts, and a searchable account list in the popup.
- Provides a full options page for account management, CSV import, CSV export, JSON export, and clearing data.
- Requires no backend, no external CDN, no paid API, and no Meta API approval.
- Uses text-based SVG placeholder icons so the source can be reviewed in GitHub/PR tools without binary preview issues.
- Can scan the visible Meta Ads Manager account switcher dropdown locally and save selected discovered accounts without the Meta API.
- Opens accounts in new tabs and includes a popup setting to choose background tabs, enabled by default.

## Install locally

1. Download or clone this folder.
2. Open Chrome or Edge and go to `chrome://extensions` or `edge://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the `meta-ads-account-switcher` folder.
6. Pin the extension to the toolbar.

## Download from GitHub / create a ZIP

If you are viewing this in a PR UI and see **Binary files are not supported**, that message is only about the preview UI. The extension source is in the `meta-ads-account-switcher/` folder.

### From GitHub

1. Merge the PR or push this branch to GitHub.
2. Open the repository on GitHub.
3. Click **Code** → **Download ZIP**.
4. Unzip the repository download.
5. Use the inner `meta-ads-account-switcher/` folder with Chrome's **Load unpacked** button.

### From terminal

Run this from the repository root:

```bash
./meta-ads-account-switcher/tools/create-zip.sh
```

It creates `meta-ads-account-switcher.zip`, which can be shared internally or uploaded as the extension package.

## Scan Ads Manager dropdown

This personal/local feature reads only visible text from the active `https://adsmanager.facebook.com/` tab. It does not use the Meta API, access tokens, a backend, or external servers.

1. Open Meta Ads Manager and log in.
2. Manually open the account switcher dropdown in Ads Manager.
3. Open this extension popup.
4. Click **Scan selected portfolio** for the safest mode, or click **Auto scan visible portfolios** to scan multiple visible portfolios. Auto scan is experimental: it clicks visible portfolio rows one by one, waits for the right-side Ad Accounts panel heading to match, and then reads the accounts Meta renders for that portfolio.
5. Review **Discovered Accounts**, warnings, counts, and grouped portfolio results.
6. Select new accounts and click **Save Selected Accounts**. Already saved accounts are disabled and marked **Saved**.

If Meta only renders accounts for the selected portfolio, the extension shows a warning that business mapping may be approximate.

## Opening accounts

Accounts open with `chrome.tabs.create()` in a new tab. By default, **Open accounts in background tab** is enabled in the popup, so your current Ads Manager tab is not redirected or replaced. Turn the setting off if you want opened accounts to become the active foreground tab.

## Add an account

1. Click the extension icon.
2. Click **Add Account**.
3. Enter the account name and ID. IDs may be entered as `557805135391043` or `act_557805135391043`; the extension stores the clean numeric ID.
4. Optionally add business name, status/tag, notes, and favorite status.
5. Click **Save Account**.

## Import CSV

1. Open the extension popup and click **Import/Export**, or right-click the extension and choose **Options**.
2. Choose a `.csv` file.
3. Click **Import CSV**.
4. Review the import summary: added rows, skipped duplicates, and invalid rows.

### CSV sample

```csv
name,accountId,businessName,status,notes,isFavorite
Godrej The Hills,557805135391043,Galaxy Reality,Active,₹300/day lead campaign,true
Example Account,act_123456789012345,Example Business,Paused,Seasonal campaign,false
```

## Export

Use the options page buttons:

- **Export CSV** downloads `meta-ads-accounts.csv`.
- **Export JSON** downloads `meta-ads-accounts.json` containing the full storage structure.

## Keyboard shortcut

The extension registers a command named **Open Meta Ads Account Switcher** with default shortcuts:

- Windows/Linux/ChromeOS: `Ctrl+Shift+M`
- macOS: `Alt+M`

Chrome may reserve or override shortcuts. You can edit extension shortcuts at `chrome://extensions/shortcuts`.

When possible, the shortcut opens the popup. If the browser does not allow opening the popup from the command, the extension opens the options page instead.

## Limitations

- The extension does not validate account IDs with Meta; it only validates that an ID contains digits and removes an optional `act_` prefix.
- Dropdown scanning depends on visible Meta Ads Manager text and may need updates if Meta changes the UI wording or structure.
- `chrome.storage.sync` has browser sync quota limits, so very large notes or very large account lists may hit storage limits.
- Opening Ads Manager still requires that you are logged into a Meta account with access to the selected ad account.

## Future upgrade ideas

- Folder/group support for clients or brands.
- Optional local-only storage mode for very large lists.
- Bulk edit favorites/status labels.
- Tag color customization.
- Optional account health checklist fields.
