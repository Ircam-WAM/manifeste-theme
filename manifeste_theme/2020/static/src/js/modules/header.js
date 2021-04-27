const body = document.body;

export default class {
  constructor() {
    this.header = document.querySelector('.js-header');
    this.toggles = Array.from(this.header.querySelectorAll('.js-header-toggle'));
    this.navigation = this.header.querySelector('.js-header-navigation');
    this.isOpen = this.header.classList.contains('is-open');
    this.offsetY = 0;

    this.init();
  }

  init() {
    this.navigation.setAttribute('aria-hidden', !this.isOpen);

    this.toggles.forEach((toggle) => {
      toggle.setAttribute('role', 'button');
      toggle.setAttribute('aria-expanded', this.isOpen);
      toggle.setAttribute('aria-controls', this.navigation.id);
      toggle.addEventListener('click', (event) => {
        event.preventDefault();
        this[this.isOpen ? 'close' : 'open']();
      });
    });

    document.addEventListener('click', (event) => {
      if (this.header !== event.target) return;
      this.close();
    });

    window.addEventListener('scroll', this.scroll.bind(this));
    this.scroll();
  }

  open() {
    this.isOpen = true;
    this.header.classList.add('is-open');
    this.navigation.setAttribute('aria-hidden', false);
    this.toggles.forEach((t) => t.setAttribute('aria-expanded', true));
    this.offsetY = window.pageYOffset;
    body.style.top = '-' + this.offsetY + 'px';
    body.classList.add('has-navigation');
  }

  close() {
    this.isOpen = false;
    this.header.classList.remove('is-open');
    this.navigation.setAttribute('aria-hidden', true);
    this.toggles.forEach((t) => t.setAttribute('aria-expanded',false));
    body.classList.remove('has-navigation');
    window.scrollTo(0, this.offsetY);
  }

  scroll() {
    if (this.isOpen) return;
    this.header.classList[(window.pageYOffset || document.documentElement.scrollTop) > 0 ? 'add' : 'remove']('has-scroll');
  }
}
