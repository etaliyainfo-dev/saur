(() => {
  if (!window.MeeshoWishlist) return;
  const callWishlist = async (wishlistAction, productId) => {
    const params = new URLSearchParams();
    params.set('action', 'meesho_ui_wishlist');
    params.set('nonce', MeeshoWishlist.nonce);
    params.set('wishlist_action', wishlistAction);
    if (productId) params.set('product_id', String(productId));
    const response = await fetch(MeeshoWishlist.ajaxUrl, { method: 'POST', body: params });
    return response.json();
  };

  document.addEventListener('click', async (event) => {
    const button = event.target.closest('.js-wishlist-toggle');
    if (!button) return;
    event.preventDefault();
    const productId = Number(button.getAttribute('data-product-id') || '0');
    const mode = button.getAttribute('data-mode') || 'add';
    const requestAction = mode === 'remove' ? 'remove' : 'add';
    const result = await callWishlist(requestAction, productId);
    if (!result.success) return;
    document.dispatchEvent(new CustomEvent('meesho:wishlist', {
      detail: { message: requestAction === 'add' ? 'Added to wishlist' : 'Removed from wishlist' }
    }));
    if (mode === 'remove') button.closest('li')?.remove();
  });
})();
