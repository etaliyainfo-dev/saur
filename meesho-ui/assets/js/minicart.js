(() => {
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('.js-minicart-qty');
    if (!button || !window.MeeshoUI) return;
    event.preventDefault();
    const cartItemKey = button.getAttribute('data-cart-item-key');
    const qty = Number(button.getAttribute('data-qty') || '1');
    const formData = new URLSearchParams();
    formData.set('action', 'meesho_ui_update_cart_qty');
    formData.set('nonce', window.MeeshoUI.nonce);
    formData.set('cart_item_key', cartItemKey || '');
    formData.set('quantity', String(qty));

    const response = await fetch(window.MeeshoUI.ajaxUrl, { method: 'POST', body: formData });
    const data = await response.json();
    if (!data.success) return;
    const content = document.querySelector('.js-minicart-content');
    if (content) content.innerHTML = data.data.mini_cart;
    const count = document.querySelector('.js-meesho-cart-count');
    if (count) count.textContent = String(data.data.count);
  });
})();
