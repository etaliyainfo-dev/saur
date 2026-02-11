(function () {
  const KEY = 'naturewell-wishlist';
  const read = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch (error) {
      return [];
    }
  };
  const write = (items) => localStorage.setItem(KEY, JSON.stringify(items));

  document.addEventListener('click', async (event) => {
    const toggle = event.target.closest('[data-wishlist-toggle]');
    if (toggle) {
      const items = read();
      const id = String(toggle.dataset.productId);
      const exists = items.some((item) => item.id === id);
      if (exists) {
        write(items.filter((item) => item.id !== id));
        toggle.textContent = '♡';
      } else {
        items.push({
          id,
          title: toggle.dataset.productTitle,
          price: toggle.dataset.productPrice,
          url: toggle.dataset.productUrl,
          image: toggle.dataset.productImage
        });
        write(items);
        toggle.textContent = '♥';
      }
      return;
    }

    const removeButton = event.target.closest('[data-remove-wishlist]');
    if (removeButton) {
      const card = removeButton.closest('[data-wishlist-id]');
      const id = card?.dataset.wishlistId;
      if (!id) return;
      write(read().filter((item) => item.id !== id));
      card.remove();
      return;
    }

    const move = event.target.closest('[data-move-to-cart]');
    if (move) {
      const card = move.closest('[data-wishlist-id]');
      const id = card?.dataset.wishlistId;
      if (!id) return;
      await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, quantity: 1 })
      });
    }
  });

  const grid = document.querySelector('[data-wishlist-grid]');
  const template = document.getElementById('wishlist-item-template');
  if (!grid || !template) return;

  read().forEach((item) => {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector('.product-card');
    card.dataset.wishlistId = item.id;
    const link = fragment.querySelector('[data-wishlist-link]');
    const image = link.querySelector('img');
    link.href = item.url;
    image.src = item.image;
    image.alt = item.title;
    fragment.querySelector('[data-wishlist-title]').textContent = item.title;
    fragment.querySelector('[data-wishlist-price]').textContent = item.price;
    grid.appendChild(fragment);
  });
})();
