/* eslint-disable class-methods-use-this */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */ // Отключение проверки camelCase для этого файла
import React, { Component } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { Rate } from "antd";
import "./Movie.css";

export default class Movie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 0,
    };

    this.shortenDescription = this.shortenDescription.bind(this);
    this.handleRatingChange = this.handleRatingChange.bind(this);
  }

  // Функция для обработки изменений значения defaultValue
  handleRatingChange(value) {
    const { movie } = this.props;
    const { id } = movie;
    console.log("ID фильма:", id, "Новый рейтинг:", value);
    this.setState({ rating: value });
  }

  // Функция для сокращения описания фильма
  shortenDescription(description, maxLength = 150) {
    if (description.length <= maxLength) return description;
    const lastSpaceIndex = description.lastIndexOf(" ", maxLength);
    return `${description.slice(0, lastSpaceIndex)}...`;
  }

  render() {
    const { movie } = this.props;
    const { title, release_date, overview, poster_path } = movie;
    const { rating } = this.state;

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

Movie.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    overview: PropTypes.string.isRequired,
    // Добавьте другие свойства, если необходимо
  }).isRequired,
};
