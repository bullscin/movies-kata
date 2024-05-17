/* eslint-disable no-console */ // Отключение проверки использования console.log
import { Component } from "react"; // Импорт компонента Component из библиотеки react
import PropTypes from "prop-types"; // Импорт PropTypes для проверки типов свойств

export default class MovieService extends Component {
  constructor(props) {
    super(props);
    // Инициализация начального состояния
    this.sessionId = null;
    // Установка API ключа и базового URL
    this.apiKey = "c1a44e8cf7f74ad0fb04c2fac5f20e4b";
    this.apiBase = "https://api.themoviedb.org/3";

    // Привязка контекста для методов
    this.createGuestSession = this.createGuestSession.bind(this);
    this.addRated = this.addRated.bind(this);
    this.handleFetchError = this.handleFetchError.bind(this);
    this.getGenres = this.getGenres.bind(this);
  }

  componentDidMount() {
    const { searchWord } = this.props;
    // Загрузка фильмов при монтировании компонента, если есть поисковый запрос
    if (searchWord) {
      this.fetchMovies(searchWord, 1);
    }

    // Пример добавления рейтинга и получения оцененных фильмов
    const movieId = 531278;
    const valueRate = 4;
    this.createGuestSession().then((sessionId) => {
      this.addRated(movieId, valueRate, sessionId);
      this.getRated(sessionId);
    });
    this.getGenres();
  }

  componentDidUpdate(prevProps) {
    const { searchWord } = this.props;

    // Проверка на изменение поискового запроса и загрузка фильмов
    if (searchWord !== prevProps.searchWord) {
      this.fetchMovies(searchWord, 1);
    }
  }

  // Обработка ошибок при запросах
  async handleFetchError(error) {
    const { setError } = this.props;
    // Проверка типа ошибки и установка соответствующего сообщения об ошибке
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

  // Получение списка оцененных фильмов
  async getRated(sessionId) {
    try {
      let ratedMovies = JSON.parse(localStorage.getItem("ratedMovies")); // Проверяем наличие данных в localStorage
      if (!ratedMovies) {
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
        // Проверяем, есть ли свойство results у объекта data
        if (data.results) {
          ratedMovies = data.results.filter((movie) => movie.rating > 0);
        } else {
          ratedMovies = [];
        }
        // localStorage.setItem("ratedMovies", JSON.stringify(ratedMovies));
      }
    } catch (error) {
      // this.handleFetchError(error);
      console.log(error);
    }
  }

  async getGenres() {
    try {
      const response = await fetch(
        `${this.apiBase}/genre/movie/list?language=en&api_key=${this.apiKey}`,
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

  // Добавление рейтинга для фильма
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

  // Создание гостевой сессии
  async createGuestSession() {
    const storedSessionId = localStorage.getItem("sessionId");
    if (storedSessionId) {
      this.sessionId = storedSessionId;
      return this.sessionId;
    }

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
      // Возвращаем null в случае ошибки
      return null;
    }
  }

  // Запрос для получения списка фильмов по поисковому запросу
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

  render() {
    return null; // Рендеринг компонента
  }
}

// Проверка типов для props компонента MovieService
MovieService.propTypes = {
  setMovies: PropTypes.func.isRequired, // Функция для установки списка фильмов
  setError: PropTypes.func.isRequired, // Функция для установки ошибки
  searchWord: PropTypes.string.isRequired, // Поисковый запрос
};

// Значения по умолчанию для props компонента MovieService
MovieService.defaultProps = {
  // setRatedMovies: () => {}, // Пустая функция для установки списка оцененных фильмов
  // ratedMovies: [], // Пустой массив для хранения оцененных фильмов
};
