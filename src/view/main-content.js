import {createElement} from "../utils.js";

const createMainContentTemplate = () => `<section class="films"></section>`;
export default class MainContent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMainContentTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
