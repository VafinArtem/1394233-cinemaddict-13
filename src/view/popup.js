import dayjs from "dayjs";
import smartView from "./smart.js";
import {AMOUNT_GENRES_FOR_SINGLE_NUMBER} from "../consts.js";

const createCommentTemplate = ({emoji, text, author, date}) => {

  return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
  </span>
  <div>
    <p class="film-details__comment-text">${text}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${dayjs(date).format(`YYYY/MM/DD HH:mm`)}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>`;
};

const createEmojiLableTemplate = (emoji) => `<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">`;

const createGenreTemplate = (elem) => `<span class="film-details__genre">${elem}</span>`;

const createGenresTemplate = (genres) => genres.map(createGenreTemplate).join(` `);

const createCommentsTemplate = (comments) => comments.map(createCommentTemplate).join(` `);

const createPopupTemplate = (film) => {
  const {poster, title, rating, genre, description, productionYear, duration, director, cast, screenwriter, country, ageRating, isWatchList, isWatched, isFavourite, comments, emojiLabel, newComment} = film;

  const productionDate = dayjs(productionYear).format(`D MMMM YYYY`);
  const durationFilm = dayjs(duration).format(`H[h] m[m]`);

  const commentsNodeTemplate = createCommentsTemplate(comments);
  const emojiLableTemplate = createEmojiLableTemplate(emojiLabel);
  const genresNodeTemplate = createGenresTemplate(genre);

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

          <p class="film-details__age">${ageRating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: The Great Flamarion</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${screenwriter.join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${cast.join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${productionDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${durationFilm}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genre.length > AMOUNT_GENRES_FOR_SINGLE_NUMBER ? `Genres` : `Genre`} </td>
              <td class="film-details__cell">
                ${genresNodeTemplate}</td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description.join(` `)}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatchList ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavourite ? `checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${commentsNodeTemplate}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            ${emojiLabel ? emojiLableTemplate : ``}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${newComment ? newComment : ``}</textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${emojiLabel === `smile` ? `checked` : ``}>
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${emojiLabel === `sleeping` ? `checked` : ``}>
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${emojiLabel === `puke` ? `checked` : ``}>
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${emojiLabel === `angry` ? `checked` : ``}>
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class Popup extends smartView {
  constructor(film) {
    super();
    this._data = Popup.parseFilmToData(film);
    this._clickHandler = this._clickHandler.bind(this);
    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favouriteClickHandler = this._favouriteClickHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
    this._newCommentInputHandler = this._newCommentInputHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._data);
  }

  static parseFilmToData(film) {
    return Object.assign(
        {},
        film,
        {
          emojiLabel: null,
          newComment: null
        }
    );
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _watchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchListClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _favouriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favouriteClick();
  }

  _newCommentInputHandler(evt) {
    evt.preventDefault();

    this.updateData({
      newComment: evt.target.value
    }, true);
  }

  _emojiChangeHandler(evt) {
    evt.preventDefault();

    const popupScrollTop = this.getElement().scrollTop;

    if (evt.target.classList.contains(`film-details__emoji-item`)) {
      this.updateData({
        emojiLabel: evt.target.value,
      });

      this.getElement().scrollTop = popupScrollTop;
    }
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.film-details__emoji-list`)
      .addEventListener(`change`, this._emojiChangeHandler);
    this.getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`input`, this._newCommentInputHandler);
  }

  restoreHandlers() {
    this.setCloseButtonClickHandler(this._callback.click);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavouriteClickHandler(this._callback.favouriteClick);
    this._setInnerHandlers();
  }

  setCloseButtonClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._clickHandler);
  }

  setWatchListClickHandler(callback) {
    this._callback.watchListClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._watchListClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  setFavouriteClickHandler(callback) {
    this._callback.favouriteClick = callback;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._favouriteClickHandler);
  }
}
