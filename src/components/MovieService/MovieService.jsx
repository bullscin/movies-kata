/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable consistent-return */
import { Component } from "react";
import PropTypes from "prop-types";

export default class MovieService extends Component {
  constructor(props) {
    super(props);
    this.sessionId = null; // Инициализируем переменную guestSessionId

    this.createGuestSession = this.createGuestSession.bind(this);
    this.addRated = this.addRated.bind(this);
  }

  componentDidMount() {
    const { searchWord } = this.props;
    this.fetchMovies(searchWord, 1);
    this.addRated();
  }

  componentDidUpdate(prevProps) {
    const { searchWord } = this.props;
    if (searchWord !== prevProps.searchWord) {
      this.fetchMovies(searchWord, 1);
    }
  }

  handleFetchError(error) {
    const { setError } = this.props;
    if (error.message === "Failed to fetch") {
      setError(
        new Error(
          "Не удалось загрузить данные. Проверьте подключение к интернету и повторите попытку.",
        ),
      );
    } else if (error.response) {
      const { status } = error.response;
      if (status === 404)
        setError(
          new Error(
            "Данные не найдены. Проверьте правильность введенных данных.",
          ),
        );
      else if (status >= 500)
        setError(
          new Error("Ошибка сервера. Попробуйте повторить запрос позже."),
        );
    } else {
      setError(new Error("Произошла ошибка. Повторите попытку позже."));
    }
  }

  async getRated() {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMWE0NGU4Y2Y3Zjc0YWQwZmIwNGMyZmFjNWYyMGU0YiIsInN1YiI6IjY2MmNjY2E5MDcyMTY2MDEyYTY5MTBiOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X-UsQjPnuHjCouNzgkskbTNBEiOwfmaQP7sCOUhH5uI",
      },
    };
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/guest_session/${this.sessionId}/rated/movies?language=en-US&page=1&sort_by=created_at.asc`,
        options,
      );
      const data = await response.json();
      console.log("getRated", data);
    } catch (error) {
      this.handleFetchError(error);
    }
  }

  async fetchMovies(querySearch, page) {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${querySearch}&include_adult=false&language=en-US&page=${page}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMWE0NGU4Y2Y3Zjc0YWQwZmIwNGMyZmFjNWYyMGU0YiIsInN1YiI6IjY2MmNjY2E5MDcyMTY2MDEyYTY5MTBiOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X-UsQjPnuHjCouNzgkskbTNBEiOwfmaQP7sCOUhH5uI",
          },
        },
      );
      const data = await response.json();
      const moviesWithRating = data.results.map(
        (movie) => ({ ...movie, rating: 0 }), // Добавляем рейтинг по умолчанию
      );
      const { setMovies } = this.props;
      setMovies(moviesWithRating, data.total_pages);
    } catch (error) {
      this.handleFetchError(error);
    }
  }

  async createGuestSession() {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMWE0NGU4Y2Y3Zjc0YWQwZmIwNGMyZmFjNWYyMGU0YiIsInN1YiI6IjY2MmNjY2E5MDcyMTY2MDEyYTY5MTBiOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X-UsQjPnuHjCouNzgkskbTNBEiOwfmaQP7sCOUhH5uI",
      },
    };

    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/authentication/guest_session/new",
        options,
      );
      const data = await response.json();
      console.log("createGuestSession", data);
      this.sessionId = data.guest_session_id;
    } catch (error) {
      this.handleFetchError(error);
    }
  }

  async addRated(movieId, valueRate) {
    try {
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMWE0NGU4Y2Y3Zjc0YWQwZmIwNGMyZmFjNWYyMGU0YiIsInN1YiI6IjY2MmNjY2E5MDcyMTY2MDEyYTY5MTBiOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X-UsQjPnuHjCouNzgkskbTNBEiOwfmaQP7sCOUhH5uI",
        },
        body: JSON.stringify({
          value: valueRate,
        }),
      };

      const guestSessionId = localStorage.getItem("sessionId");
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${guestSessionId}`,
        options,
      );
      const data = await response.json();
      console.log("addRated", data);

      const { ratedMovies } = this.props;
      // После успешного добавления рейтинга, обновляем рейтинг фильма в состоянии приложения
      const updatedRatedMovies = ratedMovies.map((movie) =>
        movie.id === movieId ? { ...movie, rating: valueRate } : movie,
      );
      const { setRatedMovies } = this.props;
      setRatedMovies(updatedRatedMovies);
    } catch (error) {
      this.handleFetchError(error);
    }
  }

  render() {
    return null;
  }
}

MovieService.propTypes = {
  setMovies: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  setRatedMovies: PropTypes.func.isRequired,
  searchWord: PropTypes.string.isRequired,
  ratedMovies: PropTypes.arrayOf(PropTypes.shape({})).isRequired, // Массив объектов фильмов (обязательный)
};
