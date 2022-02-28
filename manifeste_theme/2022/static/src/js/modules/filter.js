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

      // Makes dates toggleables
      const dates = this.inputs.filter((input) => input.classList.contains('js-filter-date'));
      dates.forEach((currentDate) => {
        currentDate.setAttribute('type', 'checkbox');

        currentDate.addEventListener('change', () => dates.forEach((date) => {
          if (date === currentDate) return;
          date.checked = false;
        }));
      });
    }

    this.inputs.forEach((input) => {
      input.addEventListener('change', this.handleChange.bind(this));
    });
  }

  checkCategories() {
    // Get active categories with item data-filter-category
    const activeCategories = [...new Set(Array.from(document.querySelector(this.replace).querySelectorAll('[data-filter-category')).reduce((acc, item) => acc.concat(item.dataset.filterCategory), []))];

    // Disable or enable category input
    this.inputs.filter((input) => input.classList.contains('js-filter-category')).forEach((category) => {
      if (activeCategories.includes(category.getAttribute('value'))) {
        category.classList.remove('is-inactive');
      } else {
        category.classList.add('is-inactive');
      }
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
          const oldItems = document.querySelector(this.replace);
          const newItems = html.querySelector(this.replace);

          // Ignore filter
          const ignore = (item) => !item.classList.contains('js-filter-dates');

          // Remove old items
          Array.from(oldItems.children).filter(ignore).forEach((item) => {
            item.classList.add('is-removed');

            setTimeout(() => {
              oldItems.removeChild(item)

              // Append new items
              Array.from(newItems.children).filter(ignore).forEach((item) => {
                item.classList.add('is-added');
                oldItems.appendChild(item);
                setTimeout(() => item.classList.remove('is-added'), 401);
              });

              this.checkCategories();
            }, 401);
          });

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
