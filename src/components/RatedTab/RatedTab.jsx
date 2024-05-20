import React, { Component } from "react";
import MovieList from "../MovieList/MovieList";

// Компонент для отображения оценённых фильмов
export default class RatedTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newratedMovies: [], // Хранит данные оценённых фильмов
    };
  }

  componentDidMount() {
    this.updateRatedMoviesFromLocalStorage();
  }

  componentDidUpdate(prevProps) {
    // Проверка, изменились ли свойства
    if (prevProps !== this.props) {
      this.updateRatedMoviesFromLocalStorage();
    }
  }

  // Метод для обновления данных оценённых фильмов из локального хранилища
  updateRatedMoviesFromLocalStorage() {
    // Получение данных оценённых фильмов из локального хранилища
    const ratedMoviesFromLocalStorage = JSON.parse(
      localStorage.getItem("ratedMovies"),
    );
    // Проверка наличия данных оценённых фильмов
    if (ratedMoviesFromLocalStorage) {
      // Обновление состояния данными оценённых фильмов
      this.setState({
        newratedMovies: [...ratedMoviesFromLocalStorage],
      });
    }
  }

  // Метод рендеринга
  render() {
    const { newratedMovies } = this.state;
    return (
      <div>
        {/* Рендеринг компонента MovieList */}
        <MovieList
          movies={newratedMovies} // Передача данных оценённых фильмов в качестве свойства
          searchPerformed={false} // Индикация выполнения поиска
          currentPage={1} // Номер текущей страницы
          totalPages={0} // Общее количество страниц
          onPageChange={() => {}} // Функция для обработки изменения страницы
          onRatingChange={() => {}} // Функция для обработки изменения оценки
        />
      </div>
    );
  }
}
