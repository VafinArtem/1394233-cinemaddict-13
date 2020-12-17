import CardFilmView from "../view/card.js";
import PopupView from "../view/popup.js";

import {KeyboardKeys} from "../utils/common.js";
import {render, RenderPosition, addElement, removeElement, replace, remove} from "../utils/render.js";

export default class Film {
  constructor(filmListContainer, siteBody) {
    this._filmListContainer = filmListContainer;
    this._siteBody = siteBody;

    this._filmComponent = null;
    this._popupComponent = null;

    this._handleOpenClick = this._handleOpenClick.bind(this);
    this._onPopupEscPress = this._onPopupEscPress.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    const prevPopupComponent = this._popupComponent;

    this._filmComponent = new CardFilmView(this._film);
    this._popupComponent = new PopupView(this._film);

    this._filmComponent.setPosterClickHandler(this._handleOpenClick);
    this._filmComponent.setCommentsClickHandler(this._handleOpenClick);
    this._filmComponent.setTitleClickHandler(this._handleOpenClick);

    if (prevFilmComponent === null || prevPopupComponent === null) {
      render(this._filmListContainer, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmListContainer.getElement().contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._siteBody.getElement().contains(prevFilmComponent.getElement())) {
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  }

  _closePopup() {
    removeElement(this._siteBody, this._popupComponent);
    this._siteBody.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, this._onPopupEscPress);
  }

  _openPopup() {
    addElement(this._siteBody, this._popupComponent);
    this._siteBody.classList.add(`hide-overflow`);
    document.addEventListener(`keydown`, this._onPopupEscPress);
    this._popupComponent.setCloseButtonClickHandler(this._handleCloseClick);
  }

  _onPopupEscPress(evt) {
    if (evt.key === KeyboardKeys.ESCAPE) {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _handleOpenClick() {
    this._openPopup();
  }

  _handleCloseClick() {
    this._closePopup();
  }
}
