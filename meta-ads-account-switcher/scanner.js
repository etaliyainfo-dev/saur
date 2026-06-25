(() => {
  if (window.__META_ADS_SWITCHER_SCANNER_READY__) return;
  window.__META_ADS_SWITCHER_SCANNER_READY__ = true;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const clean = (text) => String(text || '').replace(/\s+/g, ' ').trim();
  const normalizeId = (text) => clean(text).replace(/^act_/i, '').replace(/\D/g, '');
  const comparable = (text) => clean(text).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const isVisible = (el) => {
    if (!el || !(el instanceof Element)) return false;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
  };
  const visibleText = (el) => clean(el?.innerText || el?.textContent || '');
  const visibleLines = (el = document.body) => String(el?.innerText || '').split(/\n+/).map(clean).filter(Boolean);

  function similarName(a, b) {
    const left = comparable(a);
    const right = comparable(b);
    return Boolean(left && right && (left === right || left.includes(right) || right.includes(left)));
  }

  function hasDropdownText(el) {
    const text = visibleText(el).toLowerCase();
    return text.includes('business portfolios') && text.includes('ad accounts') && /ad account id\s*:/i.test(text);
  }

  function findDropdownRoot() {
    const candidates = [...document.querySelectorAll('[role="dialog"], [role="menu"], [role="listbox"], div, section')]
      .filter(isVisible)
      .filter(hasDropdownText)
      .map((el) => ({ el, rect: el.getBoundingClientRect(), textLength: visibleText(el).length }))
      .filter((item) => item.rect.width > 280 && item.rect.height > 180)
      .sort((a, b) => (a.rect.width * a.rect.height) - (b.rect.width * b.rect.height) || a.textLength - b.textLength);
    return candidates[0]?.el || null;
  }

  async function waitForDropdownRoot() {
    for (let i = 0; i < 8; i += 1) {
      const root = findDropdownRoot();
      if (root) return root;
      await new Promise((resolve) => {
        const observer = new MutationObserver(() => { observer.disconnect(); resolve(); });
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        setTimeout(() => { observer.disconnect(); resolve(); }, 250);
      });
    }
    return findDropdownRoot();
  }

  function accountCountFromText(text) {
    return clean(text).match(/\b\d+\s+ad accounts?\b/i)?.[0] || '';
  }

  function nameFromBusinessText(text) {
    const lines = String(text || '').split(/\n+/).map(clean).filter(Boolean);
    const countIndex = lines.findIndex((line) => /\b\d+\s+ad accounts?\b/i.test(line));
    if (countIndex > 0) return lines[countIndex - 1];
    return clean(lines[0] || '').replace(/\b\d+\s+ad accounts?.*$/i, '').trim();
  }

  function elementLooksLikeBusinessRow(el, rootRect) {
    const text = visibleText(el);
    if (!text || !/\b\d+\s+ad accounts?\b/i.test(text)) return false;
    if (/ad account id\s*:/i.test(text)) return false;
    if (/^ad accounts$/i.test(text) || /^business portfolios$/i.test(text)) return false;
    const rect = el.getBoundingClientRect();
    if (rect.left > rootRect.left + rootRect.width * 0.62) return false;
    if (rect.height < 18 || rect.height > 140) return false;
    return Boolean(nameFromBusinessText(el.innerText || el.textContent));
  }

  function collectVisiblePortfolioRows(root) {
    const rootRect = root.getBoundingClientRect();
    const rowCandidates = [...root.querySelectorAll('[role="button"], [role="option"], [tabindex], button, div')]
      .filter(isVisible)
      .filter((el) => elementLooksLikeBusinessRow(el, rootRect))
      .sort((a, b) => {
        const ar = a.getBoundingClientRect();
        const br = b.getBoundingClientRect();
        return (ar.top - br.top) || (ar.left - br.left) || ((ar.width * ar.height) - (br.width * br.height));
      });

    const rows = [];
    const seen = new Set();
    for (const el of rowCandidates) {
      const text = el.innerText || el.textContent || '';
      const name = nameFromBusinessText(text);
      const accountCountText = accountCountFromText(text);
      const key = `${comparable(name)}|${accountCountText}`;
      if (!name || seen.has(key)) continue;
      if (rows.some((row) => row.element.contains(el))) continue;
      seen.add(key);
      rows.push({ name, accountCountText, isSelected: /selected/i.test(text) || el.getAttribute('aria-selected') === 'true', element: el });
    }
    return rows;
  }


  function findPortfolioRowByName(root, row) {
    return collectVisiblePortfolioRows(root).find((candidate) => candidate.name === row.name && candidate.accountCountText === row.accountCountText)?.element || row.element;
  }

  function collectRowsAfterGentleScroll(root) {
    const rows = collectVisiblePortfolioRows(root);
    const scrollParent = rows[0]?.element?.parentElement;
    if (!scrollParent || scrollParent.scrollHeight <= scrollParent.clientHeight) return rows;
    const originalTop = scrollParent.scrollTop;
    const seen = new Map(rows.map((row) => [`${comparable(row.name)}|${row.accountCountText}`, row]));
    scrollParent.scrollTop = Math.min(scrollParent.scrollTop + scrollParent.clientHeight, scrollParent.scrollHeight);
    collectVisiblePortfolioRows(root).forEach((row) => seen.set(`${comparable(row.name)}|${row.accountCountText}`, row));
    scrollParent.scrollTop = originalTop;
    return [...seen.values()];
  }

  function findPanelCandidates(root) {
    const rootRect = root.getBoundingClientRect();
    return [...root.querySelectorAll('section, [role="region"], [role="main"], div')]
      .filter(isVisible)
      .filter((el) => {
        const text = visibleText(el);
        if (!/ad account id\s*:/i.test(text) || !/\bad accounts\b/i.test(text)) return false;
        const rect = el.getBoundingClientRect();
        return rect.left >= rootRect.left + rootRect.width * 0.35 && rect.width > 180 && rect.height > 120;
      })
      .map((el) => ({ el, rect: el.getBoundingClientRect(), len: visibleText(el).length }))
      .sort((a, b) => (a.rect.width * a.rect.height) - (b.rect.width * b.rect.height) || a.len - b.len)
      .map((item) => item.el);
  }

  function findAdAccountsPanel(root) {
    return findPanelCandidates(root)[0] || root;
  }

  function detectPanelHeading(panel) {
    const lines = visibleLines(panel);
    const adIndex = lines.findIndex((line) => /^ad accounts$/i.test(line));
    const beforeAd = adIndex >= 0 ? lines.slice(0, adIndex) : lines.slice(0, 6);
    for (let i = beforeAd.length - 1; i >= 0; i -= 1) {
      const line = beforeAd[i];
      if (!line || /^business portfolios$/i.test(line) || /\b\d+\s+ad accounts?\b/i.test(line) || /selected/i.test(line)) continue;
      return line;
    }
    return beforeAd.find((line) => line && !/\b\d+\s+ad accounts?\b/i.test(line)) || '';
  }

  function extractAccountsFromPanel(panel) {
    const lines = visibleLines(panel);
    const adStart = lines.findIndex((line) => /^ad accounts$/i.test(line));
    const slice = adStart >= 0 ? lines.slice(adStart + 1) : lines;
    const accounts = [];
    for (let i = 0; i < slice.length; i += 1) {
      const joined = `${slice[i]} ${slice[i + 1] || ''}`;
      if (!/ad account id\s*:/i.test(joined)) continue;
      const accountId = normalizeId(joined);
      if (!accountId) continue;
      let name = '';
      for (let j = i - 1; j >= Math.max(0, i - 5); j -= 1) {
        const candidate = slice[j];
        if (!candidate || /^ad accounts$/i.test(candidate) || /ad account id\s*:/i.test(candidate) || /^\d+$/.test(candidate) || /\b\d+\s+ad accounts?\b/i.test(candidate)) continue;
        name = candidate;
        break;
      }
      accounts.push({ name: name || `Ad Account ${accountId}`, accountId, isSelected: /selected|current/i.test(`${slice[i - 2] || ''} ${slice[i - 1] || ''} ${slice[i]} ${slice[i + 1] || ''}`) });
    }
    const seen = new Set();
    return accounts.filter((account) => {
      if (seen.has(account.accountId)) return false;
      seen.add(account.accountId);
      return true;
    });
  }

  async function waitForPanelMatch(root, portfolioName) {
    let panel = findAdAccountsPanel(root);
    for (let i = 0; i < 10; i += 1) {
      panel = findAdAccountsPanel(root);
      const heading = detectPanelHeading(panel);
      console.log('[Meta Ads Switcher] Panel heading detected:', heading);
      if (similarName(heading, portfolioName)) return { panel, heading, matched: true };
      await sleep(150);
    }
    return { panel, heading: detectPanelHeading(panel), matched: false };
  }

  async function scanSelectedPortfolio(root) {
    const rows = collectVisiblePortfolioRows(root);
    const selected = rows.find((row) => row.isSelected) || rows[0];
    const panel = findAdAccountsPanel(root);
    const heading = detectPanelHeading(panel);
    const portfolioName = selected?.name || heading || 'Selected Business Portfolio';
    const accountCountText = selected?.accountCountText || accountCountFromText(visibleText(panel));
    const accounts = extractAccountsFromPanel(panel);
    console.log('[Meta Ads Switcher] Panel heading detected:', heading);
    console.log('[Meta Ads Switcher] Accounts found:', accounts.length);
    const warnings = [];
    if (selected && heading && !similarName(heading, selected.name)) {
      warnings.push('Business mapping may be approximate because Meta UI only renders the selected portfolio accounts.');
    }
    return { businesses: [{ name: portfolioName, accountCountText, isSelected: true, accounts }], warnings };
  }

  async function scanAllVisiblePortfolios(root) {
    const warnings = [];
    const rows = collectRowsAfterGentleScroll(root);
    if (!rows.length) return { businesses: [], warnings: ['No visible business portfolio rows were found.'] };
    const original = rows.find((row) => row.isSelected) || rows[0];
    const businesses = [];

    for (const row of rows) {
      console.log('[Meta Ads Switcher] Clicking portfolio:', row.name);
      try {
        const rowElement = findPortfolioRowByName(root, row);
        rowElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        rowElement.click();
        await sleep(900);
        let match = await waitForPanelMatch(root, row.name);
        if (!match.matched) {
          console.log('[Meta Ads Switcher] Retrying portfolio click:', row.name);
          findPortfolioRowByName(root, row).click();
          await sleep(1000);
          match = await waitForPanelMatch(root, row.name);
        }
        if (!match.matched) {
          const reason = `Skipped ${row.name} because the ad account panel did not update.`;
          console.log('[Meta Ads Switcher] Skipped reason:', reason);
          warnings.push(reason);
          continue;
        }
        const accounts = extractAccountsFromPanel(match.panel);
        console.log('[Meta Ads Switcher] Accounts found:', accounts.length);
        businesses.push({ name: row.name, accountCountText: row.accountCountText, isSelected: row.name === original.name, accounts });
      } catch (error) {
        const reason = `Skipped ${row.name} because the ad account panel did not update.`;
        console.log('[Meta Ads Switcher] Skipped reason:', reason, error);
        warnings.push(reason);
      }
    }

    try {
      const originalElement = findPortfolioRowByName(root, original);
      originalElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      originalElement.click();
    } catch (error) {
      warnings.push('Could not restore the originally selected portfolio.');
    }

    if (warnings.length) warnings.unshift('Some portfolios were skipped because Meta did not update the account panel fast enough. Open dropdown and rescan.');
    return { businesses, warnings };
  }

  async function scanDropdown(options = {}) {
    const root = await waitForDropdownRoot();
    if (!root) return { success: false, error: 'Open the Meta Ads account switcher dropdown first, then scan again.' };
    const result = options.mode === 'auto' ? await scanAllVisiblePortfolios(root) : await scanSelectedPortfolio(root);
    const businesses = (result.businesses || []).filter((business) => (business.accounts || []).length);
    if (!businesses.length) return { success: false, error: 'Open the Meta Ads account switcher dropdown first, then scan again.', warnings: result.warnings || [] };
    return { success: true, businesses, warnings: result.warnings || [] };
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type !== 'META_ADS_SCAN_DROPDOWN') return false;
    scanDropdown({ mode: message.mode === 'auto' ? 'auto' : 'selected' }).then(sendResponse).catch((error) => sendResponse({ success: false, error: error.message || 'Could not scan Ads Manager dropdown.' }));
    return true;
  });
})();
