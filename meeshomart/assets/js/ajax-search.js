(() => {
  const data = window.MeeshoMartData || {};
  const input = document.querySelector('[data-mm-search-input]');
  const resultsBox = document.querySelector('[data-mm-search-results]');

  if (!input || !resultsBox || !data.ajaxurl || !data.nonce) {
    return;
  }

  let timer = null;

  const renderResults = (items, term) => {
    if (!Array.isArray(items) || !items.length) {
      resultsBox.innerHTML = `<p class="mm-search-empty">${data.noResults || 'No products found.'}</p>`;
      resultsBox.classList.add('is-open');
      return;
    }

    const html = items
      .map((item) => {
        const title = item.title || '';
        const price = item.price_html || '';
        const link = item.permalink || '#';
        const thumb = item.thumb_url || '';
        return `<a class="mm-search-item" href="${link}"><img src="${thumb}" alt="" loading="lazy" width="40" height="40"><span><strong>${title}</strong><small>${price}</small></span></a>`;
      })
      .join('');

    const viewAll = `<a class="mm-search-item" href="${window.location.origin}/?post_type=product&s=${encodeURIComponent(term)}"><span><strong>${data.viewAllLabel || 'View all results'}</strong></span></a>`;

    resultsBox.innerHTML = html + viewAll;
    resultsBox.classList.add('is-open');
  };

  const fetchSuggestions = async (term) => {
    const url = `${data.ajaxurl}?action=meeshomart_product_search&nonce=${encodeURIComponent(data.nonce)}&term=${encodeURIComponent(term)}`;
    const response = await fetch(url, { credentials: 'same-origin' });
    if (!response.ok) {
      return;
    }
    const json = await response.json();
    if (json && json.success) {
      renderResults(json.data, term);
    }
  };

  input.addEventListener('input', () => {
    const term = input.value.trim();
    const minChars = Number(data.minChars || 2);

    window.clearTimeout(timer);
    if (term.length < minChars) {
      resultsBox.classList.remove('is-open');
      resultsBox.innerHTML = '';
      return;
    }

    timer = window.setTimeout(() => {
      fetchSuggestions(term).catch(() => {
        resultsBox.classList.remove('is-open');
      });
    }, 250);
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.mm-header-search')) {
      resultsBox.classList.remove('is-open');
    }
  });
})();
