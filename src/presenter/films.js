import SortView from "../view/sort.js";
import MainContentView from "../view/main-content.js";
import FilmsBoardView from "../view/films-board.js";
import FilmsListView from "../view/films-list.js";
import NoFilmView from "../view/no-film.js";
import ShowMoreButtonView from "../view/show-more-btn.js";
import FilmPresenter from "./film.js";

import {generateRandomComment} from "../moks/comments.js";

import {FilmListTitles, SortType, UpdateType, UserAction} from "../consts.js";
import {getRandomInteger, sortByRating, sortingByRating, sortByComments, sortByDate} from "../utils/common.js";
import {render, RenderPosition, remove} from "../utils/render.js";

const FILMS_AMOUNT_PER_STEP = 5;

const CommentsAmount = {
  MIN: 1,
  MAX: 5,
};

const MAXIMUM_EXTRA_FILMS = 2;

export default class Films {
  constructor(filmsContainer, siteBody, filmsModel) {
    this._filmsModel = filmsModel;
    this._filmsContainer = filmsContainer;
    this._siteBody = siteBody;
    this._renderFilmsAmount = FILMS_AMOUNT_PER_STEP;
    this._filmPresenter = {};
    this._topRatedFilmPresenter = {};
    this._mostCommentedFilmPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._mainContentComponent = new MainContentView();
    this._filmsBoardComponent = new FilmsBoardView(FilmListTitles.ALL);
    this._filmsListComponent = new FilmsListView();
    this._noFilmComponent = new NoFilmView();
    this._topRatedFilmsBoardComponent = new FilmsBoardView(FilmListTitles.TOP_RATED);
    this._mostCommentedBoardComponent = new FilmsBoardView(FilmListTitles.MOST_COMMENTED);

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderSort();
    render(this._filmsContainer, this._mainContentComponent, RenderPosition.BEFOREEND);
    render(this._mainContentComponent, this._filmsBoardComponent, RenderPosition.BEFOREEND);
    render(this._filmsBoardComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderFilmsList(true);
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._filmsModel.getFilms().slice().sort(sortByDate);
      case SortType.RATING:
        return this._filmsModel.getFilms().slice().sort(sortingByRating);
    }
    return this._filmsModel.getFilms();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmList({resetRenderFilmsAmount: true});
    this._renderFilmsList();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._filmsContainer, this._sortComponent, RenderPosition.BEFOREEND);

  }

  _renderFilm(filmListElement, film, presenter) {
    const filmPresenter = new FilmPresenter(filmListElement, this._siteBody, this._handleViewAction, this._handleModeChange);
    filmPresenter.init(film);
    presenter[film.id] = filmPresenter;
  }

  _clearBoard({resetRenderFilmsAmount = false, resetSortType = false} = {}) {
    const filmAmount = this._getFilms().length;

    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};

    remove(this._sortComponent);
    remove(this._renderNoFilms);
    remove(this._showMoreButtonComponent);

    if (resetRenderFilmsAmount) {
      this._renderFilmsAmount = FILMS_AMOUNT_PER_STEP;
    } else {
      this._renderFilmsAmount = Math.min(filmAmount, this._renderFilmsAmount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(this._filmsListComponent, film, this._filmPresenter));
  }

  _renderFilmsList(shouldRenderExtraList) {
    const filmAmount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmAmount, FILMS_AMOUNT_PER_STEP));

    if (filmAmount === 0) {
      this._renderNoFilms();
      remove(this._sortComponent);
      return;
    }

    for (let film of this._getFilms()) {
      film.comments = new Array(getRandomInteger(CommentsAmount.MIN, CommentsAmount.MAX)).fill(``).map(generateRandomComment);
    }

    this._renderFilms(films);

    if (filmAmount > this._renderFilmsAmount) {
      this._renderShowMoreButton();
    }

    if (shouldRenderExtraList) {
      this._renderTopRatedList();
      this._renderMostCommentedList();
    }
  }

  _renderNoFilms() {
    render(this._filmsListComponent, this._noFilmComponent, RenderPosition.BEFOREEND);
  }

  _clearFilmList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderFilmsAmount = FILMS_AMOUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.IS_WATCH_LIST:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.IS_WATCHED:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.IS_FAVOURITES:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._filmPresenter[data.id].init(data);

        this._updatePresenter(this._filmPresenter, data);
        this._updatePresenter(this._topRatedFilmPresenter, data);
        this._updatePresenter(this._mostCommentedFilmPresenter, data);
        break;
      case UpdateType.MINOR:
        this._clearFilms();
        this._renderFilms();
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        this._clearFilms({resetRenderFilmsAmount: true, resetSortType: true});
        this._renderFilms();
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  }

  _updatePresenter(presenter, updatedFilm) {
    if (presenter.hasOwnProperty(updatedFilm.id)) {
      presenter[updatedFilm.id].init(updatedFilm);
    }
  }

  _handleShowMoreButtonClick() {
    const filmAmount = this._getFilms().length;
    const newRenderFilmsAmount = Math.min(filmAmount, this._renderFilmsAmount + FILMS_AMOUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderFilmsAmount, this._renderFilmsAmount + FILMS_AMOUNT_PER_STEP);

    this._renderFilms(films);
    this._renderFilmsAmount = newRenderFilmsAmount;

    if (this._renderFilmsAmount >= filmAmount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._filmsBoardComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _renderTopRatedList() {
    const topRatedFilmsListComponent = new FilmsListView();
    render(this._mainContentComponent, this._topRatedFilmsBoardComponent, RenderPosition.BEFOREEND);
    render(this._topRatedFilmsBoardComponent, topRatedFilmsListComponent, RenderPosition.BEFOREEND);

    sortByRating(this._getFilms()).slice(0, MAXIMUM_EXTRA_FILMS).forEach((film) => {
      this._renderFilm(topRatedFilmsListComponent, film, this._topRatedFilmPresenter);
    });
  }

  _renderMostCommentedList() {
    const mostCommentedListComponent = new FilmsListView();
    render(this._mainContentComponent, this._mostCommentedBoardComponent, RenderPosition.BEFOREEND);
    render(this._mostCommentedBoardComponent, mostCommentedListComponent, RenderPosition.BEFOREEND);

    sortByComments(this._getFilms()).slice(0, MAXIMUM_EXTRA_FILMS).forEach((film) => {
      this._renderFilm(mostCommentedListComponent, film, this._mostCommentedFilmPresenter);
    });
  }
}
