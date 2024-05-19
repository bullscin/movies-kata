/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { Rate } from "antd";
import { Context } from "../MovieApp/MovieApp"; // Импорт контекста
import "./MovieCard.css"; // Импорт стилей

export default class MovieCard extends Component {
  constructor(props) {
    super(props);
    this.shortenDescription = this.shortenDescription.bind(this);
    this.handleRatingChange = this.handleRatingChange.bind(this);
  }

  // Метод для обработки изменения рейтинга
  handleRatingChange(value) {
    const { movie, onRatingChange } = this.props;
    const { id } = movie;
    onRatingChange(id, value);
  }

  // Метод для сокращения описания
  shortenDescription(description, maxLength = 150) {
    if (description.length <= maxLength) return description;
    const lastSpaceIndex = description.lastIndexOf(" ", maxLength);
    return `${description.slice(0, lastSpaceIndex)}...`;
  }

  render() {
    const { movie, newratedMovies } = this.props;
    const { title, release_date, overview, poster_path, rating, genre_ids } =
      movie || newratedMovies;
    const formattedDate = release_date
      ? format(new Date(release_date), "yyyy-MM-dd")
      : "Invalid Date";

    return (
      <Context.Consumer>
        {(genresList) => (
          <li className="movies-item">
            {" "}
            {/* Элемент списка фильмов */}
            <img
              src={`https://image.tmdb.org/t/p/original${poster_path}`} // URL изображения
              alt={title} // Альтернативный текст изображения
              className="movies-img" // Класс для стилизации изображения
            />
            <div className="movies-info">
              {" "}
              {/* Информация о фильме */}
              <h2 className="title">{title}</h2> {/* Название фильма */}
              <p className="date">{formattedDate}</p> {/* Дата выпуска */}
              <div className="genre">
                {" "}
                {/* Жанры фильма */}
                {genre_ids.map((genreId) => {
                  // Маппинг по массиву идентификаторов жанров
                  const genre = genresList.genres.find((g) => g.id === genreId); // Поиск соответствующего жанра по идентификатору
                  return (
                    genre && ( // Если жанр существует
                      <button className="text" type="button" key={genreId}>
                        {" "}
                        {/* Кнопка с названием жанра */}
                        {genre.name} {/* Название жанра */}
                      </button>
                    )
                  );
                })}
              </div>
              <p className="description">{this.shortenDescription(overview)}</p>{" "}
              {/* Описание фильма */}
              <Rate
                count={10} // Количество звезд в рейтинге
                allowHalf // Возможность ставить полузвезды
                value={rating} // Значение рейтинга
                className="rate" // Класс для стилизации рейтинга
                onChange={this.handleRatingChange} // Обработчик изменения рейтинга
              />
            </div>
          </li>
        )}
      </Context.Consumer>
    );
  }
}

// Проверка типов для props компонента Movie
MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired, // Идентификатор фильма
    title: PropTypes.string.isRequired, // Название фильма
    overview: PropTypes.string.isRequired, // Описание фильма
  }).isRequired, // Обязательный объект фильма
};
