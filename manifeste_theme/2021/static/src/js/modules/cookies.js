export default class Cookies {
  constructor() {
    this.cookies = document.querySelector('.js-cookies');

    if (this.cookies) {
      this.init();
    }
  }

  init() {
    // Remove banner if cookies accepted (better do server side to prevent flash during loading)
    if (this.checkCookie()) {
      this.removeBanner();
    }

    // Remove banner and create cookie when clicking button
    this.cookies.querySelector('.js-cookies-button').addEventListener('click', (event) => {
      event.preventDefault();
      this.createCookie();
      this.removeBanner();
    })
  }

  removeBanner() {
    this.cookies.parentNode.removeChild(this.cookies);
  }

  // Cf. https://developer.mozilla.org/fr/docs/Web/API/Document/cookie
  createCookie() {
    document.cookie = "acceptCookies=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
  }

  deleteCookie() {
    document.cookie = "acceptCookies=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  checkCookie() {
    return document.cookie.replace(/(?:(?:^|.*;\s*)acceptCookies\s*\=\s*([^;]*).*$)|^.*$/, "$1") === "true";
  }
}
