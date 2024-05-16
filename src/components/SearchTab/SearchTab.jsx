/* eslint-disable react/prop-types */ // Отключение проверки prop-types для этого файлов
import React, { Component } from "react";
import MovieService from "../MovieService/MovieService"; // Импорт сервиса для работы с фильмами
import MovieSearch from "../MovieSearch/MovieSearch"; // Импорт компонента поиска фильмов
import MovieList from "../MovieList/MovieList"; // Импорт компонента списка фильмов
import Spin from "../Spin/Spin"; // Импорт компонента загрузки
import Alert from "../Alert/Alert"; // Импорт компонента оповещения об ошибке

export default class SearchTab extends Component {
  constructor(props) {
    super(props);
    // Инициализация состояния компонента
    this.state = {
      movies: [], // Список фильмов
      loading: false, // Флаг загрузки
      error: null, // Ошибка
      query: "", // Поисковый запрос
      searchPerformed: false, // Флаг выполненного поиска
      currentPage: 1, // Текущая страница
      totalPages: 0, // Общее количество страниц
    };
    // Привязка контекста для обработчиков событий
    this.handleSearchQueryChange = this.handleSearchQueryChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.setMovies = this.setMovies.bind(this);
    this.setError = this.setError.bind(this);
    this.movieService = new MovieService({
      // Инициализация сервиса для работы с фильмами
      setMovies: this.setMovies,
      setError: this.setError,
    });
    this.handleRatingChange = this.handleRatingChange.bind(this);
  }

  // Обработчик изменения поискового запроса
  handleSearchQueryChange(query) {
    this.setState({ query, loading: true, searchPerformed: true });
  }

  // Обработчик изменения текущей страницы
  handlePageChange(page) {
    this.setState({ currentPage: page, loading: true }, () => {
      const { query, currentPage } = this.state;
      // Вызываем метод для загрузки фильмов с учетом новой страницы
      this.movieService.fetchMovies(query, currentPage);
    });
  }

  // Обработчик изменения рейтинга фильма
  handleRatingChange(movieId, rating) {
    const { movies } = this.state;
    const updatedMovies = movies.map((movie) => {
      if (movie.id === movieId) {
        return { ...movie, rating };
      }
      return movie;
    });

    // Обновляем список фильмов и сохраняем рейтинги
    this.setState({ movies: updatedMovies }, () => {
      localStorage.setItem("movies", JSON.stringify(updatedMovies));
      const ratedMovies = updatedMovies.filter((movie) => movie.rating > 0);
      localStorage.setItem("ratedMovies", JSON.stringify(ratedMovies));
    });
  }

  // Метод для установки списка фильмов
  setMovies(movies, totalPages) {
    this.setState({ movies, totalPages, loading: false, error: null });
  }

  // Метод для установки ошибки
  setError(error) {
    this.setState({ error, loading: false });
  }

  render() {
    const {
      movies,
      loading,
      error,
      searchPerformed,
      currentPage,
      totalPages,
      query,
    } = this.state;

    return (
      <div>
        {/* Компонент поиска фильмов */}
        <MovieSearch onQueryChange={this.handleSearchQueryChange} />
        {/* Отображение ошибки, если есть */}
        {error && (
          <Alert
            type="error"
            message="Oops, something went wrong!"
            description={error.message}
          />
        )}
        {/* Отображение спиннера во время загрузки */}
        {loading && <Spin />}
        {/* Компонент сервиса для загрузки фильмов */}
        <MovieService
          ref={(movieService) => {
            this.movieService = movieService;
          }}
          setMovies={this.setMovies}
          setError={this.setError}
          searchWord={query}
        />
        {/* Оповещение, если поиск выполнен, но фильмы не найдены */}
        {searchPerformed && movies.length === 0 && !error && !loading && (
          <Alert description="" message="Результаты не найдены" type="info" />
        )}
        {/* Отображение списка фильмов */}
        {!error && movies.length > 0 && (
          <MovieList
            movies={movies}
            loading={loading}
            searchPerformed={searchPerformed}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={this.handlePageChange}
            onRatingChange={(movieId, rating) => {
              this.handleRatingChange(movieId, rating);
            }}
          />
        )}
      </div>
    );
  }
}
