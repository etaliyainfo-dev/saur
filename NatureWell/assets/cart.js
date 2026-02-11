(function () {
  const drawer = document.querySelector('[data-cart-drawer]');
  if (!drawer) return;

  const openDrawer = () => {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('overflow-hidden');
  };
  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('overflow-hidden');
  };

  document.querySelectorAll('[data-cart-toggle]').forEach((trigger) => trigger.addEventListener('click', openDrawer));
  drawer.querySelectorAll('[data-cart-close]').forEach((trigger) => trigger.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDrawer();
  });

  const updateLine = async (key, quantity) => {
    const response = await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity })
    });
    if (!response.ok) return;
    const cart = await response.json();
    const subtotal = drawer.querySelector('[data-cart-subtotal]');
    const count = document.querySelector('[data-cart-count]');
    if (subtotal) subtotal.textContent = Shopify.formatMoney(cart.total_price);
    if (count) count.textContent = cart.item_count;
    if (quantity === 0) {
      drawer.querySelector(`[data-key="${key}"]`)?.remove();
    }
  };

  drawer.addEventListener('click', (event) => {
    const line = event.target.closest('[data-line-item]');
    if (!line) return;
    const input = line.querySelector('[data-qty-input]');
    if (!input) return;
    let quantity = Number(input.value);
    if (event.target.matches('[data-qty-plus]')) quantity += 1;
    if (event.target.matches('[data-qty-minus]')) quantity = Math.max(0, quantity - 1);
    if (!event.target.matches('[data-qty-plus], [data-qty-minus]')) return;
    input.value = quantity;
    updateLine(line.dataset.key, quantity);
  });
})();
