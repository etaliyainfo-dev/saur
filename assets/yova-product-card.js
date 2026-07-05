(() => {
  const selectors = {
    form: '[data-yova-cart-form]',
    countdown: '[data-yova-countdown]',
    cartDrawer: 'cart-drawer',
    cartNotification: 'cart-notification',
    cartBubble: '.cart-count-bubble'
  };
  const pendingForms = new WeakSet();

  const formatCountdown = (diff) => {
    const total = Math.max(0, Math.floor(diff / 1000));
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    return `${days > 0 ? `${days}d ` : ''}${hours}h:${String(minutes).padStart(2, '0')}m:${String(seconds).padStart(2, '0')}s`;
  };

  const tickCountdowns = () => {
    document.querySelectorAll(selectors.countdown).forEach((node) => {
      const end = new Date(node.getAttribute('datetime')).getTime();
      if (!end) return;
      const diff = end - Date.now();
      if (diff <= 0) {
        node.hidden = true;
        return;
      }
      node.hidden = false;
      node.textContent = formatCountdown(diff);
      node.setAttribute('aria-label', `Offer ends in ${node.textContent}`);
    });
  };

  const getCartElement = () => document.querySelector(selectors.cartDrawer) || document.querySelector(selectors.cartNotification);

  const normalizeSection = (section) => {
    if (typeof section === 'string') return { id: section, section, selector: `#shopify-section-${section}` };
    return {
      id: section.id || section.section,
      section: section.section || section.id,
      selector: section.selector || `#shopify-section-${section.section || section.id}`
    };
  };

  const getSectionsToRender = (cartElement) => {
    if (cartElement && typeof cartElement.getSectionsToRender === 'function') {
      return cartElement.getSectionsToRender().map(normalizeSection);
    }
    return [
      { id: 'cart-drawer', section: 'cart-drawer', selector: '#CartDrawer' },
      { id: 'cart-icon-bubble', section: 'cart-icon-bubble', selector: '#shopify-section-cart-icon-bubble' }
    ];
  };

  const sectionIds = (sections) => [...new Set(sections.map((section) => section.section || section.id).filter(Boolean))];

  const parseSectionHTML = (html, selector) => new DOMParser().parseFromString(html, 'text/html').querySelector(selector);

  const renderSection = (section, html) => {
    if (!html) return;
    const target = document.querySelector(section.selector) || document.getElementById(section.id);
    const source = parseSectionHTML(html, section.selector) || parseSectionHTML(html, `#shopify-section-${section.section}`) || parseSectionHTML(html, `#${section.id}`);
    if (target && source) target.innerHTML = source.innerHTML;
  };

  const fetchCartSections = async (sections) => {
    const url = `${window.location.pathname}?sections=${encodeURIComponent(sectionIds(sections).join(','))}`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Unable to refresh cart.');
    return response.json();
  };

  const updateCartBubble = async () => {
    const bubble = document.querySelector(selectors.cartBubble);
    if (!bubble) return;
    const response = await fetch(`${window.Shopify?.routes?.root || '/'}cart.js`, { headers: { Accept: 'application/json' } });
    const cart = await response.json();
    bubble.textContent = cart.item_count;
    bubble.hidden = cart.item_count === 0;
  };

  const openCartDrawer = (cartElement) => {
    if (!cartElement) return;
    if (typeof cartElement.open === 'function') {
      cartElement.open();
      return;
    }
    cartElement.classList.add('active', 'animate');
    document.body.classList.add('overflow-hidden');
  };

  const renderDawnCart = async (item, sections) => {
    const cartElement = getCartElement();
    const sectionHTML = await fetchCartSections(sections);
    const parsedState = { ...item, sections: sectionHTML };

    if (cartElement && typeof cartElement.renderContents === 'function') {
      cartElement.renderContents(parsedState);
    } else {
      sections.forEach((section) => renderSection(section, sectionHTML[section.section] || sectionHTML[section.id]));
    }

    await updateCartBubble();
    openCartDrawer(getCartElement() || cartElement);
  };

  const buildAddPayload = (form) => {
    const formData = new FormData(form);
    formData.delete('sections');
    formData.delete('sections_url');
    return formData;
  };

  const setFormState = (form, isLoading, message = '', isError = false) => {
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.yova-card__form-message');
    if (button) {
      button.disabled = isLoading;
      button.setAttribute('aria-busy', isLoading ? 'true' : 'false');
      if (!isLoading) button.removeAttribute('aria-busy');
    }
    if (status) {
      status.textContent = message;
      status.toggleAttribute('aria-invalid', isError);
    }
  };

  const addToCart = async (form) => {
    if (pendingForms.has(form)) return;
    pendingForms.add(form);
    setFormState(form, true);
    try {
      const cartElement = getCartElement();
      const sections = getSectionsToRender(cartElement);
      const addUrl = `${window.Shopify?.routes?.root || '/'}cart/add.js`;
      const response = await fetch(addUrl, {
        method: 'POST',
        body: buildAddPayload(form),
        headers: { Accept: 'application/json' }
      });
      const item = await response.json();
      if (!response.ok || item.status) throw new Error(item.description || item.message || 'Unable to add this item.');
      await renderDawnCart(item, sections);
      document.dispatchEvent(new CustomEvent('yova:cart:add', { bubbles: true, detail: item }));
      document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true, detail: item }));
      setFormState(form, false);
    } catch (error) {
      setFormState(form, false, error.message || 'Unable to add this item.', true);
    } finally {
      pendingForms.delete(form);
    }
  };

  const initSliders = () => {
    document.querySelectorAll('[data-yova-slider]').forEach((slider) => {
      if (slider.dataset.yovaReady === 'true' || slider.dataset.autoplay !== 'true') return;
      slider.dataset.yovaReady = 'true';
      const speed = Number(slider.dataset.speed) || 4500;
      setInterval(() => {
        if (slider.matches(':hover') || document.hidden) return;
        const grid = slider.querySelector('.yova-grid');
        const item = grid?.firstElementChild;
        if (!grid || !item) return;
        const nextLeft = slider.scrollLeft + item.getBoundingClientRect().width;
        const maxLeft = slider.scrollWidth - slider.clientWidth - 4;
        const shouldLoop = slider.dataset.loop === 'true';
        if (nextLeft > maxLeft && !shouldLoop) return;
        slider.scrollTo({ left: nextLeft > maxLeft ? 0 : nextLeft, behavior: 'smooth' });
      }, speed);
    });
  };

  document.addEventListener('submit', (event) => {
    const form = event.target.closest(selectors.form);
    if (!form || !form.hasAttribute('data-yova-ajax-cart')) return;
    event.preventDefault();
    addToCart(form);
  });

  tickCountdowns();
  initSliders();
  document.addEventListener('shopify:section:load', () => { tickCountdowns(); initSliders(); });
  setInterval(tickCountdowns, 1000);
})();
