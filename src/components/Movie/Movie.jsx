/* eslint-disable no-console */ // Отключение проверки на использование console.log
/* eslint-disable class-methods-use-this */ // Отключение требования использования this внутри класса
/* eslint-disable react/prop-types */ // Отключение проверки prop-types для этого файла
/* eslint-disable camelcase */ // Отключение проверки camelCase для этого файла
import React, { Component } from "react";
import PropTypes from "prop-types"; // Импорт библиотеки prop-types
import { format } from "date-fns"; // Импорт функции форматирования даты из библиотеки date-fns
import { Rate } from "antd"; // Импорт компонента Rate из библиотеки antd
import "./Movie.css"; // Импорт стилей для компонента Movie

export default class Movie extends Component {
  constructor(props) {
    super(props);
    // Инициализация состояния компонента
    this.state = {
      rating: 0, // Рейтинг фильма
    };

    // Привязка контекста для методов класса
    this.shortenDescription = this.shortenDescription.bind(this);
    this.handleRatingChange = this.handleRatingChange.bind(this);
  }

  // Обработчик изменения рейтинга фильма
  handleRatingChange(value) {
    const { movie, onRatingChange } = this.props; // Получение фильма и обработчика из props
    const { id } = movie;
    this.setState({ rating: value }); // Установка нового значения рейтинга в состоянии
    onRatingChange(id, value); // Вызов обработчика изменения рейтинга с передачей id фильма и его рейтинга
  }

  // Функция для сокращения описания фильма
  shortenDescription(description, maxLength = 150) {
    if (description.length <= maxLength) return description;
    const lastSpaceIndex = description.lastIndexOf(" ", maxLength);
    return `${description.slice(0, lastSpaceIndex)}...`;
  }

  render() {
    const { movie, newratedMovies } = this.props; // Получение фильма и новых оцененных фильмов из props
    const { title, release_date, overview, poster_path } =
      movie || newratedMovies; // Деструктуризация свойств фильма

    const { rating } = this.state; // Получение текущего рейтинга из состояния

    // Форматирование даты выпуска фильма
    const formattedDate = release_date
      ? format(new Date(release_date), "yyyy-MM-dd")
      : "Invalid Date";

    return (
      // Элемент списка фильмов
      <li className="movies-item">
        {/* Изображение фильма */}
        <img
          src={`https://image.tmdb.org/t/p/original${poster_path}`}
          alt={title}
          className="movies-img"
        />
        <div className="movies-info">
          {/* Название фильма */}
          <h2 className="title">{title}</h2>
          {/* Дата выпуска фильма */}
          <p className="date">{formattedDate}</p>
          {/* Жанры фильма (заглушка) */}
          <div className="genre">
            <p className="text">action</p>
            <p className="text">drama</p>
          </div>
          {/* Описание фильма */}
          <p className="description">{this.shortenDescription(overview)}</p>
          {/* Компонент Rate с обработчиком изменения */}
          <Rate
            count={10}
            allowHalf
            defaultValue={rating}
            className="rate"
            onChange={this.handleRatingChange}
          />
        </div>
      </li>
    );
  }
}

// Проверка типов для props компонента Movie
Movie.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    overview: PropTypes.string.isRequired,
    // Добавьте другие свойства, если необходимо
  }).isRequired,
};
