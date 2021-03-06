import AbstractView from "./abstract.js";
import {FilmListTitles} from "../consts.js";

export default class FilmsBoard extends AbstractView {
  constructor(title) {
    super();
    this._title = title;
  }

  getTemplate() {
    return `<section class="films-list ${this._title === FilmListTitles.ALL ? `` : `films-list--extra`}">
    <h2 class="films-list__title ${this._title === FilmListTitles.ALL ? `visually-hidden` : ``}">${this._title}</h2>
  </section>`;
  }
}
