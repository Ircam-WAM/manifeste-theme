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

    // Outerclick
    document.addEventListener('click', (event) => {
      if (this.header !== event.target) return;
      this.header.classList.remove('is-open');
      body.classList.remove('has-navigation');
      window.scrollTo(0, offsetY);
    });

    window.addEventListener('scroll', this.scroll.bind(this));
    this.scroll();
  }

  scroll() {
    if (body.classList.contains('has-navigation')) return;
    this.header.classList[(window.pageYOffset || document.documentElement.scrollTop) > 0 ? 'add' : 'remove']('has-scroll');
  }
}
