const body = document.body;

export default class {
  constructor() {
    this.header = document.querySelector('.js-header');

    this.init();
  }

  init() {
    // Overlay
    let offsetY = 0;
    Array.from(this.header.querySelectorAll('.js-header-menu')).forEach((menu) => menu.addEventListener('click', (event) => {
      event.preventDefault();

      this.header.classList.toggle('is-open');

      if (this.header.classList.contains('is-open')) {
        offsetY = window.pageYOffset;
        body.style.top = '-' + offsetY + 'px';
        body.classList.add('has-navigation');

      } else if (body.classList.contains('has-navigation')) {
        body.classList.remove('has-navigation');
        window.scrollTo(0, offsetY);
      }
    }));

    // Submenus
    const items = Array.from(this.header.querySelectorAll('.js-header-item.has-submenu'));
    items.forEach((item) => item.querySelector('.js-header-toggle').addEventListener('click', () => {
      // For mobile
      item.classList.toggle(item.classList.contains('is-active') ? 'is-closed' : 'is-open');

      // For desktop
      items.forEach((i) => i.classList[i === item ? 'toggle' : 'remove']('is-open-only'));

      // Outerclick
      document.addEventListener('click', (event) => {
        if (!item.classList.contains('is-open-only') || item === event.target || item.contains(event.target)) return;
        item.classList.remove('is-open-only')
      });
    }));

    // Locale
    this.header.querySelector('.js-header-locale').addEventListener('change', (event) => event.target.form.submit());
  }
}
