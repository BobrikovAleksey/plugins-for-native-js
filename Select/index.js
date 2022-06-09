import '/Select/styles.scss';

/**
 * Возвращает шаблон компонента
 * @param items {{id: number, value: string}[]}
 * @param placeholder {string}
 * @returns {string}
 */
const getTemplate = (items, placeholder) => {
  const list = items.map((item) => `
    <li class="select__item" data-type="item" data-id="${item.id}">${item.value}</li>
  `);

  return `
    <div class="select__backdrop" data-type="backdrop"></div>
    <div class="select__input" data-type="input" data-id="-1">
      <span class="select__input_title" data-type="value">${placeholder}</span>
      <span class="select__input_icon"><i class="fa-solid fa-chevron-down"></i></span>
    </div>
    <div class="select__dropdown">
      <ul class="select__list">${list.join('')}</ul>
    </div>`;
};

class Select {
  /**
   * @param selector {string}
   * @param items {{id: number, value: string}[]} список вариантов
   * @param placeholder {string}
   * @param selectedId {number}
   * @param onChange {Function}
   */
  constructor(selector, {
    items,
    placeholder,
    selectedId,
    onChange,
  }) {
    this.$el = document.querySelector(selector);
    this.options = {
      items: Array.isArray(items) ? items : [],
      placeholder: (typeof placeholder === 'string') ? placeholder : 'Select item',
      selectedId: (typeof selectedId === 'number') && (selectedId >= 0) ? selectedId : -1,
      onChange: (typeof onChange === 'function') ? onChange.bind(this) : null,
    };
    this.#render();
    this.#setup();

    window.s = this;
  }

  #render() {
    const { items, placeholder } = this.options;
    this.$el.classList.add('select');
    this.$el.innerHTML = getTemplate(items, placeholder);
  }

  #setup() {
    this.$input = this.$el.querySelector('[data-type="input"]');
    this.$items = this.$el.querySelectorAll('[data-type="item"]');
    this.$value = this.$input.querySelector('[data-type="value"]');
    this.clickHandler = this.clickHandler.bind(this);
    this.$el.addEventListener('click', this.clickHandler);
    if (this.options.selectedId >= 0) this.change(this.options.selectedId);
  }

  #itemsUpdate() {
    this.$items.forEach((item) => (Number(item.dataset.id) === this.selectedId)
      ? item.classList.add('selected')
      : item.classList.remove('selected'));
  }

  clickHandler(event) {
    const { id, type } = event.target.dataset;
    switch (type) {
      case 'input':
        this.toggle();
        break;
      case 'backdrop':
        this.close();
        break;
      case 'item':
        if (this.change(Number(id))) this.#itemsUpdate();
        this.close();
    }
  }

  get isOpen() {
    return this.$el.classList.contains('open');
  }

  get selectedId() {
    return Number(this.$input.dataset.id);
  }

  get value() {
    const { items, placeholder } = this.options;
    return items.find((item) => item.id === this.selectedId)?.value ?? placeholder;
  }

  change(id) {
    const oldId = this.selectedId;
    const current = this.options.items.find((item) => item.id === id);
    this.$input.dataset.id = current ? current.id : '-1';
    this.$value.textContent = this.value;
    if (this.options.onChange) this.options.onChange();
    return this.selectedId !== oldId;
  }

  reset() {
    this.$input.dataset.id = '-1';
    this.$value.textContent = this.options.placeholder;
  }

  close() {
    this.$el.classList.remove('open');
  }

  open() {
    this.$el.classList.add('open');
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  destroy() {
    this.$el.removeEventListener('click', this.clickHandler);
    this.$el.parentElement.removeChild(this.$el);
  }
}

export {
  Select,
};
