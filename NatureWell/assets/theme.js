(function () {
  const body = document.body;

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.getElementById('mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      mobileNav.classList.toggle('is-open');
    });
  }

  const filterToggle = document.querySelector('[data-filter-toggle]');
  const filterDrawer = document.querySelector('[data-filter-drawer]');
  const filterClose = document.querySelector('[data-filter-close]');
  if (filterToggle && filterDrawer) {
    const toggleFilter = (open) => {
      filterDrawer.classList.toggle('is-open', open);
      filterDrawer.setAttribute('aria-hidden', String(!open));
      body.classList.toggle('overflow-hidden', open);
    };
    filterToggle.addEventListener('click', () => toggleFilter(true));
    if (filterClose) filterClose.addEventListener('click', () => toggleFilter(false));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') toggleFilter(false);
    });
  }

  document.querySelectorAll('[data-showcase]').forEach((showcase) => {
    const items = Array.from(showcase.querySelectorAll('.watch-item'));
    let active = items.findIndex((item) => item.classList.contains('is-active'));
    const render = () => items.forEach((item, index) => item.classList.toggle('is-active', index === active));
    showcase.querySelector('[data-showcase-prev]')?.addEventListener('click', () => {
      active = (active - 1 + items.length) % items.length;
      render();
    });
    showcase.querySelector('[data-showcase-next]')?.addEventListener('click', () => {
      active = (active + 1) % items.length;
      render();
    });
  });

  document.querySelectorAll('[data-testimonial-slider]').forEach((slider) => {
    const cards = Array.from(slider.children);
    const dotsWrap = slider.parentElement.querySelector('[data-testimonial-dots]');
    if (!dotsWrap || cards.length === 0) return;
    let current = 0;
    cards.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = index === 0 ? 'is-active' : '';
      dot.addEventListener('click', () => {
        current = index;
        cards.forEach((card, cIndex) => {
          card.style.display = cIndex === current || window.innerWidth >= 768 ? 'block' : 'none';
        });
        dotsWrap.querySelectorAll('button').forEach((button, bIndex) => button.classList.toggle('is-active', bIndex === current));
      });
      dotsWrap.appendChild(dot);
    });
    if (window.innerWidth < 768) {
      cards.forEach((card, index) => {
        card.style.display = index === 0 ? 'block' : 'none';
      });
    }
  });

  document.querySelectorAll('[data-sticky-add]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelector('.main-product form[action*="/cart/add"] button[type="submit"]')?.click();
    });
  });
})();
