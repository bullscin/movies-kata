/* eslint-disable no-console */
import { Component } from "react";
import PropTypes from "prop-types";

export default class MovieService extends Component {
  constructor(props) {
    super(props);
    this.sessionId = null;
    this.apiKey = "c1a44e8cf7f74ad0fb04c2fac5f20e4b";
    this.apiBase = "https://api.themoviedb.org/3";

    this.createGuestSession = this.createGuestSession.bind(this);
    this.addRated = this.addRated.bind(this);
    this.handleFetchError = this.handleFetchError.bind(this);
  }

  componentDidMount() {
    const movieId = 531278;
    const valueRate = 4;
    this.createGuestSession().then((sessionId) => {
      this.addRated(movieId, valueRate, sessionId);
      this.getRated(sessionId);
    });
  }

  componentDidUpdate(prevProps) {
    const { searchWord } = this.props;

    if (searchWord !== prevProps.searchWord) {
      this.fetchMovies(searchWord, 1);
    }
  }

  async handleFetchError(error) {
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

  async getRated(sessionId) {
    try {
      const response = await fetch(
        `${this.apiBase}/guest_session/${sessionId}/rated/movies?api_key=${this.apiKey}&language=en-US`,
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
      console.log(data);
    } catch (error) {
      this.handleFetchError(error);
    }
  }

  async fetchMovies(querySearch, page) {
    const { setMovies } = this.props;
    try {
      const response = await fetch(
        `${this.apiBase}/search/movie?query=${querySearch}&include_adult=false&language=en-US&page=${page}&api_key=${this.apiKey}`,
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
      setMovies(data.results, data.total_pages);
    } catch (error) {
      this.handleFetchError(error);
    }
  }

  async createGuestSession() {
    try {
      const response = await fetch(
        `${this.apiBase}/authentication/guest_session/new?api_key=${this.apiKey}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );
      const data = await response.json();
      this.sessionId = data.guest_session_id;
      localStorage.setItem("sessionId", this.sessionId);
      return this.sessionId;
    } catch (error) {
      this.handleFetchError(error);
      // Добавляем возврат значения в случае ошибки
      return null;
    }
  }

  async addRated(movieId, valueRate, sessionId) {
    try {
      await fetch(
        `${this.apiBase}/movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${sessionId}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            value: valueRate,
          }),
        },
      );
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
  searchWord: PropTypes.string.isRequired,
};

MovieService.defaultProps = {
  // setRatedMovies: () => {},
  // ratedMovies: [],
};
