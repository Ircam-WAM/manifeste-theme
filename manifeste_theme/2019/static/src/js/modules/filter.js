import debounce from 'lodash.debounce';

class Filter {
  constructor(filter) {
    this.filter = filter;
    this.inputs = Array.from(this.filter.querySelectorAll('.js-filter-input'));
    this.method = this.filter.getAttribute('method');
    this.action = this.filter.getAttribute('action');
    this.replace = this.filter.dataset.filterReplace;
    this.isLoading = false;

    this.init();
  }

  async init() {
    const { default: axios } = await import(/* webpackChunkName: "axios" */ 'axios');
    await import(/* webpackChunkName: "axios" */ 'es6-promise/auto');
    this.axios = axios;

    this.filter.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleChange(event);
    });

    this.inputs.forEach((input) => {
      input.addEventListener('change', debounce(this.handleChange.bind(this), 250));
      input.addEventListener('keyup', debounce(this.handleChange.bind(this), 250));
    });
  }

  showError(message) {
    document.querySelector(this.replace).innerHTML = `<div class="c-messages u-mts">
        <ul class="c-messages__items">
          <li class="c-messages__item c-messages__item--error">${message}</li>
        </ul>
      </div>`;
  }

  handleChange(event) {
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
          const replace = html.querySelector(this.replace);

          if (replace) {
            document.querySelector(this.replace).innerHTML = replace.innerHTML;
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
    this.filter.classList[isLoading ? 'add' : 'remove']('loading');
  }
}

export default class {
  constructor() {
    this.filters = [];
    Array.from(document.querySelectorAll('.js-filter[data-filter-replace]')).forEach((filter) => {
      this.filters.push(new Filter(filter));
    });
  }
}
