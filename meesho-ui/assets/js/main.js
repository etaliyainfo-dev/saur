(() => {
  const body = document.body;
  document.querySelectorAll('.js-open-minicart').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const drawer = document.getElementById('meesho-minicart-drawer');
      if (!drawer) return;
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
    });
  });

  document.querySelectorAll('.js-close-drawer').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-target');
      const drawer = target ? document.getElementById(target) : button.closest('.meesho-drawer');
      if (!drawer) return;
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    body.querySelectorAll('.meesho-drawer.is-open').forEach((drawer) => {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
    });
  });

  document.querySelector('.js-focus-search')?.addEventListener('click', () => {
    document.querySelector('.js-search-input')?.focus();
  });
})();
