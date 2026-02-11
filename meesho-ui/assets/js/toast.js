(() => {
  const wrap = document.querySelector('.meesho-toast-wrap');
  if (!wrap) return;

  const showToast = (message) => {
    const node = document.createElement('div');
    node.className = 'meesho-toast';
    node.textContent = message;
    wrap.appendChild(node);
    setTimeout(() => node.remove(), 2200);
  };

  document.body.addEventListener('added_to_cart', () => showToast('Added to cart'));
  document.addEventListener('meesho:wishlist', (event) => showToast(event.detail?.message || 'Wishlist updated'));
})();
