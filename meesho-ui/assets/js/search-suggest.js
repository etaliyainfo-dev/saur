(() => {
  const input = document.querySelector('.js-search-input');
  const box = document.querySelector('.js-search-suggestions');
  if (!input || !box || !window.MeeshoUI) return;
  let timer;

  const skeleton = '<div class="skeleton">Loading...</div>';

  input.addEventListener('input', () => {
    clearTimeout(timer);
    const query = input.value.trim();
    if (query.length < 2) {
      box.hidden = true;
      box.innerHTML = '';
      return;
    }

    timer = setTimeout(async () => {
      box.hidden = false;
      box.innerHTML = skeleton;
      const params = new URLSearchParams({ action: 'meesho_ui_search', nonce: MeeshoUI.searchNonce, query });
      const response = await fetch(`${MeeshoUI.ajaxUrl}?${params.toString()}`);
      const result = await response.json();
      if (!result.success) return;
      if (!result.data.length) {
        box.innerHTML = '<p>No results.</p>';
        return;
      }
      box.innerHTML = result.data.map((item) => `<a href="${item.permalink}"><strong>${item.title}</strong><span>${item.price_html}</span></a>`).join('');
    }, 240);
  });
})();
