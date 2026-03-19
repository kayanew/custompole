'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /*** Elements ***/
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const closeBtn = document.getElementById('sidebarClose');
  const toggleBtn = document.getElementById('filterToggleBtn');
  const loader = document.getElementById('page-loader');
  const rangeMin = document.getElementById('rangeMin');
  const rangeMax = document.getElementById('rangeMax');
  const priceMin = document.getElementById('priceMin');
  const priceMax = document.getElementById('priceMax');
  const searchInput = document.getElementById('searchInput');
  const productGrid = document.getElementById('productGrid');
  const productCountEl = document.getElementById('productCount');
  const applyFiltersBtn = document.querySelector('.apply-filters-btn');
  const clearFiltersBtn = document.querySelector('.clear-filters-btn');
  const sortSelect = document.getElementById('sort-select');
  const paginationNav = document.getElementById('pagination');

  const ITEMS_PER_PAGE = 10;
  let currentPage = 1;

  /*** Sidebar ***/
  const toggleSidebar = (open) => {
    sidebar?.classList.toggle('open', open);
    overlay?.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
    toggleBtn?.setAttribute('aria-expanded', String(open));
  };

  toggleBtn?.addEventListener('click', () => toggleSidebar(true));
  closeBtn?.addEventListener('click', () => toggleSidebar(false));
  overlay?.addEventListener('click', () => toggleSidebar(false));
  document.addEventListener('keydown', e => e.key === 'Escape' && toggleSidebar(false));
  window.addEventListener('resize', () => window.innerWidth > 1024 && toggleSidebar(false));

  /*** Collapsible Filter Groups ***/
  document.querySelectorAll('.filter-group-header').forEach(header => {
    header.addEventListener('click', () => {
      const group = header.closest('.filter-group');
      const collapsed = group?.classList.toggle('collapsed');
      header.setAttribute('aria-expanded', String(!collapsed));
    });
  });

  /*** Price Display ***/
  const updatePriceDisplay = () => {
    if (!rangeMin || !rangeMax || !priceMin || !priceMax) return;
    let [min, max] = [parseInt(rangeMin.value, 10), parseInt(rangeMax.value, 10)];
    if (min > max) [min, max] = [max, min];
    priceMin.textContent = `Rs ${min}`;
    priceMax.textContent = `Rs ${max}`;
  };

  [rangeMin, rangeMax].forEach(el => el?.addEventListener('input', () => {
    updatePriceDisplay();
    filterProducts();
  }));

  /*** Product Navigation ***/
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      btn.classList.add('loading');
      btn.textContent = 'Loading…';
      loader?.classList.add('visible');
      document.body.classList.add('page-leaving');
      setTimeout(() => window.location.href = `/mvp/public/pages/product-details.php?id=${id}`, 250);
    });
  });

  window.addEventListener('pageshow', () => {
    document.body.classList.remove('page-leaving');
    document.body.style.overflow = '';
    loader?.classList.remove('visible');
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.remove('loading');
      btn.textContent = 'View Product';
    });
  });

  /*** Filter Utilities ***/
  const getCheckedValues = (group) =>
    [...document.querySelectorAll(`[data-group="${group}"] input[type="checkbox"]`)]
      .filter(cb => cb.checked)
      .map(cb => cb.value);

  const getFilteredCards = () =>
    [...document.querySelectorAll('.product-card')].filter(card => card.dataset.filterVisible === '1');

  const sortCards = (cards) => {
    if (!sortSelect) return cards;
    const option = sortSelect.value;
    if (option === 'low-high') return cards.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
    if (option === 'high-low') return cards.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
    return cards;
  };

  /*** Pagination ***/
  const renderPagination = (cards) => {
    if (!paginationNav) return;
    const totalPages = Math.max(1, Math.ceil(cards.length / ITEMS_PER_PAGE));
    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageCards = cards.slice(start, start + ITEMS_PER_PAGE);

    document.querySelectorAll('.product-card').forEach(card => card.style.display = 'none');
    pageCards.forEach(card => card.style.display = '');

    paginationNav.innerHTML = '';

    const createBtn = (text, disabled, onClick, active = false) => {
      const btn = document.createElement('button');
      btn.className = `page-btn${active ? ' active' : ''}`;
      btn.textContent = text;
      btn.disabled = disabled;
      btn.addEventListener('click', onClick);
      paginationNav.appendChild(btn);
    };

    createBtn('‹', currentPage === 1, () => { currentPage--; renderPagination(cards); });
    for (let i = 1; i <= totalPages; i++) {
      createBtn(String(i), false, () => { currentPage = i; renderPagination(cards); }, i === currentPage);
    }
    createBtn('›', currentPage === totalPages, () => { currentPage++; renderPagination(cards); });
  };

  /*** Filter Logic ***/
  const filterProducts = () => {
    if (!productGrid) return;

    const query = searchInput?.value.trim().toLowerCase() || '';
    const selectedPets = getCheckedValues('pet-type');
    const selectedTypes = getCheckedValues('product-type');
    const minPrice = parseFloat(rangeMin?.value || '0');
    const maxPrice = parseFloat(rangeMax?.value || '5000');

    document.querySelectorAll('.product-card').forEach(card => {
      const name = card.querySelector('.card-name')?.textContent.trim().toLowerCase() || '';
      const desc = card.querySelector('.card-desc')?.textContent.trim().toLowerCase() || '';
      const pet = (card.dataset.pet || '').toLowerCase();
      const type = (card.dataset.type || '').toLowerCase();
      const price = parseFloat(card.dataset.price || '0');

      const visible =
        (query === '' || name.includes(query) || desc.includes(query) || pet.includes(query) || type.includes(query)) &&
        (selectedPets.length === 0 || selectedPets.includes(pet)) &&
        (selectedTypes.length === 0 || selectedTypes.includes(type)) &&
        price >= Math.min(minPrice, maxPrice) &&
        price <= Math.max(minPrice, maxPrice);

      card.dataset.filterVisible = visible ? '1' : '0';
    });

    const filtered = sortCards(getFilteredCards());
    renderPagination(filtered);
    if (productCountEl) productCountEl.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;
  };

  /*** Event Listeners ***/
  searchInput?.addEventListener('input', filterProducts);
  sortSelect?.addEventListener('change', filterProducts);
  applyFiltersBtn?.addEventListener('click', () => { toggleSidebar(false); filterProducts(); });
  clearFiltersBtn?.addEventListener('click', () => {
    document.querySelectorAll('[data-group="pet-type"] input, [data-group="product-type"] input').forEach(cb => cb.checked = false);
    if (searchInput) searchInput.value = '';
    if (rangeMin) rangeMin.value = rangeMin.min || 0;
    if (rangeMax) rangeMax.value = rangeMax.max || 5000;
    if (sortSelect) sortSelect.value = 'relevance';
    updatePriceDisplay();
    filterProducts();
  });

  /*** Init ***/
  updatePriceDisplay();
  filterProducts();
});