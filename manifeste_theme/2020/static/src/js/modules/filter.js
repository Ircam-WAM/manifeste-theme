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
      await import(/* webpackChunkName: "axios" */ 'url-search-params-polyfill');
      this.axios = axios;

      this.filter.removeAttribute('onchange');

      this.filter.addEventListener('submit', (event) => {
        event.preventDefault();
        this.handleChange(event);
      });

      this.checkCategories();
    }

    this.inputs.forEach((input) => {
      input.addEventListener('change', this.handleChange.bind(this));
    });
  }

  checkCategories() {
    // Get active categories with item data-filter-category
    const activeCategories = [...new Set(Array.from(document.querySelector(this.replace).querySelectorAll('[data-filter-category]')).reduce((acc, item) => acc.concat(item.dataset.filterCategory), []))];

    // Disable or enable category input
    this.inputs.forEach((category) => {
      const isActive = activeCategories.includes(category.getAttribute('value'));
      category.classList[isActive ? 'remove' : 'add']('is-inactive')
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

      const data = new FormData(this.filter);

      this.axios({
        url: this.action,
        method: this.method,
        [this.method === 'post' ? 'data' : 'params']: this.method === 'post' ? data : new URLSearchParams(data),
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
          const replace = html.querySelector(this.replace);

          if (replace) {
            document.querySelector(this.replace).innerHTML = replace.innerHTML;

            this.checkCategories();

            if ('replaceState' in history) {
              history.replaceState({}, '', '?' + new URLSearchParams(data));
            }
          } else {
            this.showError('Error: no content to replace');
          }

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
    this.filter.classList[isLoading ? 'add' : 'remove']('is-loading');
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
