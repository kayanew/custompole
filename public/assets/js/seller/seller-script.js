function setupDropdown(toggleSelector, menuSelector) {
  const toggleBtn = document.querySelector(toggleSelector);
  const items     = document.querySelectorAll(`${menuSelector} .dropdown-item`);

  if (!toggleBtn || !items.length) return;

  items.forEach(item => {
    item.addEventListener("click", function () {
      toggleBtn.textContent = this.textContent;
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {

  setupDropdown(
    '.action-bar .btn-outline-success.dropdown-toggle',
    '.action-bar .btn-outline-success + .dropdown-menu'
  );

  setupDropdown(
    '.action-bar .btn-outline-info.dropdown-toggle',
    '.action-bar .btn-outline-info + .dropdown-menu'
  );

});