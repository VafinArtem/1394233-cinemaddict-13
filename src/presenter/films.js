// import NavigationView from "../view/navigation.js";
import FilterView from "../view/site-menu.js";
import StatsLinkView from "../view/stats-link.js";
import SortView from "../view/sort.js";
import MainContentView from "../view/main-content.js";
import FilmsBoardView from "../view/films-board.js";
import FilmsListView from "../view/films-list.js";
import NoFilmView from "../view/no-film.js";
import ShowMoreButtonView from "../view/show-more-btn.js";
import FilmPresenter from "./film.js";

import {generateRandomComment} from "../moks/comments.js";

import {FilmListTitles} from "../consts.js";
import {getRandomInteger, sortByRating, sortByComments} from "../utils/common.js";
import {render, RenderPosition, remove} from "../utils/render.js";

const FILMS_AMOUNT_PER_STEP = 5;

const ComentsAmmount = {
  MIN: 1,
  MAX: 5,
};

export default class Films {
  constructor(filmsContainer, siteBody) {
    this._filmsContainer = filmsContainer;
    this._siteBody = siteBody;
    this._renderFilmsAmount = FILMS_AMOUNT_PER_STEP;

    // this._navigationComponent = new NavigationView();
    this._mainContentComponent = new MainContentView();
    this._sortComponent = new SortView();
    this._filter = new FilterView();
    this._statsLink = new StatsLinkView();
    this._filmsBoardComponent = new FilmsBoardView(FilmListTitles.ALL);
    this._filmsListComponent = new FilmsListView();
    this._noFilmComponent = new NoFilmView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._topRatedFilmsBoardComponent = new FilmsBoardView(FilmListTitles.TOP_RATED);
    this._mostCommentedBoardComponent = new FilmsBoardView(FilmListTitles.MOST_COMMENTED);

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(filmList) {
    this._filmList = filmList.slice();

    // render(this._filmsContainer, this._navigationComponent, RenderPosition.BEFOREEND);
    this._renderSort();
    render(this._filmsContainer, this._mainContentComponent, RenderPosition.BEFOREEND);
    render(this._mainContentComponent, this._filmsBoardComponent, RenderPosition.BEFOREEND);
    render(this._filmsBoardComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderFilmsList();
  }

  _renderSort() {
    render(this._filmsContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  // _renderFilter() {
  //   render(this._navigationComponent, this._filter, RenderPosition.BEFOREEND);
  // }

  // _renderStats() {
  //   render(this._navigationComponent, this._statsLink, RenderPosition.BEFOREEND);
  // }

  _renderFilm(filmListElement, film) {
    const filmPresenter = new FilmPresenter(filmListElement, this._siteBody);
    filmPresenter.init(film);
  }

  _renderFilms(from, to) {
    this._filmList
    .slice(from, to)
    .forEach((filmItem) => this._renderFilm(this._filmsListComponent, filmItem));
  }

  _renderFilmsList() {
    if (this._filmList.length === 0) {
      this._renderNoFilms();
      remove(this._sortComponent);
      return;
    }

    for (let film of this._filmList) {
      film.comments = new Array(getRandomInteger(ComentsAmmount.MIN, ComentsAmmount.MAX)).fill(``).map(generateRandomComment);
    }

    this._renderFilms(0, Math.min(this._filmList.length, this._renderFilmsAmount));

    if (this._filmList.length > this._renderFilmsAmount) {
      this._renderShowMoreButton();
    }

    this._renderTopRatedList();
    this._renderMostCommentedList();
  }

  _renderNoFilms() {
    render(this._filmsListComponent, this._noFilmComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    this._filmList.slice(this._renderFilmsAmount, this._renderFilmsAmount + FILMS_AMOUNT_PER_STEP).forEach((filmsElements) => this._renderFilm(this._filmsListComponent, filmsElements));
    this._renderFilmsAmount += FILMS_AMOUNT_PER_STEP;

    if (this._renderFilmsAmount >= this._filmList.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsBoardComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderTopRatedList() {
    const topRatedFilmsListComponent = new FilmsListView();
    render(this._mainContentComponent, this._topRatedFilmsBoardComponent, RenderPosition.BEFOREEND);
    render(this._topRatedFilmsBoardComponent, topRatedFilmsListComponent, RenderPosition.BEFOREEND);

    sortByRating(this._filmList).slice(0, 2).forEach((film) => {
      this._renderFilm(topRatedFilmsListComponent, film);
    });
  }

  _renderMostCommentedList() {
    const mostCommentedListComponent = new FilmsListView();
    render(this._mainContentComponent, this._mostCommentedBoardComponent, RenderPosition.BEFOREEND);
    render(this._mostCommentedBoardComponent, mostCommentedListComponent, RenderPosition.BEFOREEND);

    sortByComments(this._filmList).slice(0, 2).forEach((film) => {
      this._renderFilm(mostCommentedListComponent, film);
    });
  }
}