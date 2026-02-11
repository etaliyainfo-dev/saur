(() => {
  const body = document.body;
  const cartDrawer = document.querySelector('[data-mm-cart-drawer]');
  const filterDrawer = document.querySelector('[data-mm-filter-drawer]');
  const searchInput = document.querySelector('[data-mm-search-input]');

  const toggleDrawer = (drawer, open) => {
    if (!drawer) {
      return;
    }
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    body.classList.toggle('mm-no-scroll', open);
  };

  document.addEventListener('click', (event) => {
    const openCart = event.target.closest('[data-mm-open-cart]');
    const closeCart = event.target.closest('[data-mm-close-cart]');
    const openFilters = event.target.closest('[data-mm-open-filters]');
    const closeFilters = event.target.closest('[data-mm-close-filters]');
    const focusSearch = event.target.closest('[data-mm-focus-search]');

    if (openCart && cartDrawer) {
      event.preventDefault();
      toggleDrawer(cartDrawer, true);
    }
    if (closeCart && cartDrawer) {
      event.preventDefault();
      toggleDrawer(cartDrawer, false);
    }
    if (openFilters && filterDrawer) {
      event.preventDefault();
      toggleDrawer(filterDrawer, true);
    }
    if (closeFilters && filterDrawer) {
      event.preventDefault();
      toggleDrawer(filterDrawer, false);
    }
    if (focusSearch && searchInput) {
      event.preventDefault();
      searchInput.focus();
    }
  });
})();
