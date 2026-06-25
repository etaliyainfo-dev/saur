(() => {
  if (window.__META_ADS_SWITCHER_SCANNER_READY__) return;
  window.__META_ADS_SWITCHER_SCANNER_READY__ = true;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const clean = (text) => String(text || '').replace(/\s+/g, ' ').trim();
  const normalizeId = (text) => clean(text).replace(/^act_/i, '').replace(/\D/g, '');
  const isVisible = (el) => {
    if (!el || !(el instanceof Element)) return false;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
  };

  function visibleLines() {
    return String(document.body?.innerText || '')
      .split(/\n+/)
      .map(clean)
      .filter(Boolean);
  }

  function hasDropdownText(lines) {
    const text = lines.join('\n').toLowerCase();
    return text.includes('business portfolios') && text.includes('ad accounts') && /ad account id\s*:/i.test(text);
  }

  async function waitForDropdown() {
    for (let i = 0; i < 8; i += 1) {
      const lines = visibleLines();
      if (hasDropdownText(lines)) return lines;
      await new Promise((resolve) => {
        const observer = new MutationObserver(() => {
          observer.disconnect();
          resolve();
        });
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        setTimeout(() => { observer.disconnect(); resolve(); }, 250);
      });
    }
    return visibleLines();
  }

  function parseBusinesses(lines) {
    const start = lines.findIndex((line) => /^business portfolios$/i.test(line));
    const adStart = lines.findIndex((line, index) => index > start && /^ad accounts$/i.test(line));
    if (start < 0) return [];
    const slice = lines.slice(start + 1, adStart > start ? adStart : undefined);
    const businesses = [];
    for (let i = 0; i < slice.length; i += 1) {
      const line = slice[i];
      const next = slice[i + 1] || '';
      const countMatch = next.match(/\b\d+\s+ad accounts?\b/i) || line.match(/\b\d+\s+ad accounts?\b/i);
      if (!countMatch) continue;
      const name = line.replace(/\b\d+\s+ad accounts?.*$/i, '').trim();
      if (!name || /^ad accounts$/i.test(name)) continue;
      businesses.push({
        name,
        accountCountText: countMatch[0],
        isSelected: /selected/i.test(`${line} ${next}`),
        accounts: []
      });
    }
    return businesses;
  }

  function parseAccounts(lines) {
    const adStart = lines.findIndex((line) => /^ad accounts$/i.test(line));
    const accounts = [];
    const slice = adStart >= 0 ? lines.slice(adStart + 1) : lines;
    for (let i = 0; i < slice.length; i += 1) {
      const match = slice[i].match(/ad account id\s*:\s*(act_)?([0-9][0-9\s-]*)/i);
      if (!match) continue;
      const accountId = normalizeId(match[0]);
      let name = '';
      for (let j = i - 1; j >= Math.max(0, i - 4); j -= 1) {
        const candidate = slice[j];
        if (!candidate || /^ad accounts$/i.test(candidate) || /ad account id\s*:/i.test(candidate) || /\b\d+\s+ad accounts?\b/i.test(candidate)) continue;
        name = candidate;
        break;
      }
      if (accountId) accounts.push({ name: name || `Ad Account ${accountId}`, accountId, isSelected: /selected/i.test(`${slice[i - 2] || ''} ${slice[i - 1] || ''} ${slice[i]}`) });
    }
    const seen = new Set();
    return accounts.filter((account) => {
      if (seen.has(account.accountId)) return false;
      seen.add(account.accountId);
      return true;
    });
  }

  function parseVisibleText(lines) {
    const businesses = parseBusinesses(lines);
    const accounts = parseAccounts(lines);
    const selectedBusiness = businesses.find((business) => business.isSelected) || businesses[0] || { name: 'Selected Business Portfolio', accountCountText: '', isSelected: true, accounts: [] };
    selectedBusiness.accounts = accounts;
    const warnings = [];
    if (businesses.length > 1 && accounts.length) {
      warnings.push('Business mapping may be approximate because Meta UI only renders the selected portfolio accounts.');
    }
    const grouped = selectedBusiness.name ? businesses.map((business) => business.name === selectedBusiness.name ? selectedBusiness : business) : [selectedBusiness];
    return { businesses: grouped.filter((business) => business.accounts.length || business.name), warnings };
  }

  function findPortfolioRows(lines) {
    const names = parseBusinesses(lines).map((business) => business.name).filter(Boolean);
    const rows = [];
    for (const name of names) {
      const candidates = [...document.querySelectorAll('div,span,button,[role="button"],[role="option"]')]
        .filter(isVisible)
        .filter((el) => clean(el.innerText || el.textContent).includes(name));
      const row = candidates.find((el) => /\b\d+\s+ad accounts?\b/i.test(clean(el.innerText || el.textContent))) || candidates[0];
      if (row && !rows.some((item) => item.name === name)) rows.push({ name, element: row });
    }
    return rows;
  }

  async function autoScanPortfolios(initialLines) {
    const warnings = ['Auto scan all visible portfolios is experimental because Meta UI can change.'];
    const rows = findPortfolioRows(initialLines);
    if (rows.length <= 1) return null;
    const businesses = [];
    const original = rows.find((row) => /selected/i.test(clean(row.element.innerText || row.element.textContent))) || rows[0];
    for (const row of rows) {
      try {
        row.element.click();
        await sleep(750);
        const parsed = parseVisibleText(visibleLines());
        const current = parsed.businesses.find((business) => business.isSelected) || parsed.businesses.find((business) => business.name === row.name) || parsed.businesses[0];
        if (current) businesses.push({ ...current, name: row.name || current.name });
      } catch (error) {
        warnings.push(`Could not scan portfolio: ${row.name}`);
      }
    }
    try { original.element.click(); } catch (error) { warnings.push('Could not restore the originally selected portfolio.'); }
    const seen = new Set();
    return {
      businesses: businesses.map((business) => ({ ...business, accounts: (business.accounts || []).filter((account) => {
        const key = `${business.name}:${account.accountId}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }) })),
      warnings
    };
  }

  async function scanDropdown(options = {}) {
    const lines = await waitForDropdown();
    if (!hasDropdownText(lines)) {
      return { success: false, error: 'Open the Meta Ads account switcher dropdown first, then scan again.' };
    }
    let parsed = null;
    if (options.autoScan) parsed = await autoScanPortfolios(lines);
    if (!parsed) parsed = parseVisibleText(lines);
    const businesses = (parsed.businesses || []).filter((business) => (business.accounts || []).length);
    if (!businesses.length) {
      return { success: false, error: 'Open the Meta Ads account switcher dropdown first, then scan again.' };
    }
    return { success: true, businesses, warnings: parsed.warnings || [] };
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type !== 'META_ADS_SCAN_DROPDOWN') return false;
    scanDropdown({ autoScan: Boolean(message.autoScan) }).then(sendResponse).catch((error) => sendResponse({ success: false, error: error.message || 'Could not scan Ads Manager dropdown.' }));
    return true;
  });
})();
