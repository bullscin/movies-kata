/* eslint-disable no-console */ // Отключение проверки на использование console.log
import React, { Component } from "react";
import MovieList from "../MovieList/MovieList"; // Импорт компонента списка фильмов

export default class RatedTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newratedMovies: [], // Состояние компонента - массив новых оцененных фильмов
    };
  }

  componentDidMount() {
    // Вызов метода для обновления списка оцененных фильмов из localStorage при монтировании компонента
    this.updateRatedMoviesFromLocalStorage();
  }

  componentDidUpdate(prevProps) {
    // Проверка, изменились ли свойства компонента
    if (prevProps !== this.props) {
      // Если изменились, вызываем метод для обновления списка оцененных фильмов из localStorage
      this.updateRatedMoviesFromLocalStorage();
    }
  }

  // Метод для обновления списка оцененных фильмов из localStorage
  updateRatedMoviesFromLocalStorage() {
    const { newratedMovies } = this.state;
    // Проверяем, есть ли уже фильмы в состоянии компонента
    if (newratedMovies.length === 0) {
      // Получаем фильмы из localStorage
      const ratedMoviesFromLocalStorage = JSON.parse(
        localStorage.getItem("ratedMovies"),
      );
      if (ratedMoviesFromLocalStorage) {
        // Обновляем состояние компонента новыми оцененными фильмами
        this.setState({
          newratedMovies: [...ratedMoviesFromLocalStorage],
        });
      }
    }
  }

  render() {
    const { newratedMovies } = this.state;
    // Вывод списка оцененных фильмов с помощью компонента MovieList
    return (
      <div>
        <MovieList
          movies={newratedMovies}
          searchPerformed={false} // Флаг выполненного поиска (замените на нужное значение)
          currentPage={1} // Текущая страница (замените на нужное значение)
          totalPages={0} // Общее количество страниц (замените на нужное значение)
          onPageChange={() => {}} // Обработчик изменения страницы (замените на нужную функцию)
          onRatingChange={() => {}} // Обработчик изменения рейтинга (замените на нужную функцию)
        />
      </div>
    );
  }
}
