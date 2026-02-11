(() => {
  document.querySelectorAll('.js-open-filters').forEach((button) => {
    button.addEventListener('click', () => {
      const drawer = document.getElementById('meesho-filter-drawer');
      if (!drawer) return;
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
    });
  });
})();
