import debounce from 'lodash.debounce';

class Filter {
  constructor(filter) {
    this.filter = filter;
    this.inputs = Array.from(this.filter.querySelectorAll('.js-filter-input'));
    this.method = this.filter.getAttribute('method');
    this.action = this.filter.getAttribute('action');
    this.replace = this.filter.dataset.filterReplace || false;
    this.isLoading = false;

    this.init();
  }

  async init() {
    if (this.replace) {
      const { default: axios } = await import(/* webpackChunkName: "axios" */ 'axios');
      await import(/* webpackChunkName: "axios" */ 'es6-promise/auto');
      this.axios = axios;

      this.filter.addEventListener('submit', (event) => {
        event.preventDefault();
        this.handleChange(event);
      });
    }

    this.inputs.forEach((input) => {
      input.addEventListener('change', debounce(this.handleChange.bind(this), 250));
    });
  }

  showError(message) {
    alert(message);
  }

  handleChange(event) {
    if (!this.replace) {
      this.filter.submit();
      return;
    }

    if (!this.isLoading) {
      this.setLoading(true);

      this.axios({
        url: this.action,
        method: this.method,
        data: new FormData(this.filter),
        config: {
          headers: {
            'Content-Type': 'text/html'
          }
        }

      }).then((response) => {
        this.setLoading(false);

        if (response.status === 200) {
          const parser = new DOMParser();
          const html = parser.parseFromString(response.data, 'text/html');
          const replace = document.querySelector(this.replace);
          // Ignore filter
          const ignore = (item) => !item.querySelector('.js-filter');

          // Remove old items
          Array.from(replace.children).filter(ignore).forEach((item) => replace.removeChild(item));

          // // Append new items
          Array.from(html.querySelector(this.replace).children).filter(ignore).forEach((item) => replace.appendChild(item));

        } else {
          this.showError(`Error: Request failed with status code ${response.status} (${statusText})`);
        }

      }).catch((error) => {
        this.setLoading(false);
        this.showError(error);
      });
    }
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;
    this.filter.classList[isLoading ? 'add' : 'remove']('loading');
  }
}

export default class {
  constructor() {
    this.filters = [];
    Array.from(document.querySelectorAll('.js-filter')).forEach((filter) => {
      this.filters.push(new Filter(filter));
    });
  }
}
