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
    this.getBorderColor = this.getBorderColor.bind(this);
  }

  // Метод для обработки изменения рейтинга
  handleRatingChange(value) {
    const { movie, onRatingChange } = this.props;
    const { id } = movie;
    onRatingChange(id, value);
  }

  // Метод для получения цвета границы
  getBorderColor(vote_average) {
    if (vote_average >= 7) return "#66E900";
    if (vote_average >= 5) return "#E9D100";
    if (vote_average >= 3) return "#E97E00";
    return "#E90000";
  }

  // Метод для сокращения описания
  shortenDescription(description, maxLength = 150) {
    if (description.length <= maxLength) return description;
    const lastSpaceIndex = description.lastIndexOf(" ", maxLength);
    return `${description.slice(0, lastSpaceIndex)}...`;
  }

  render() {
    const { movie, newratedMovies } = this.props;
    const {
      title,
      release_date,
      overview,
      poster_path,
      rating,
      genre_ids,
      vote_average,
    } = movie || newratedMovies;
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
              className="movies-img hidden" // Класс для стилизации изображения
            />
            <div className="movies-info ">
              <img
                src={`https://image.tmdb.org/t/p/original${poster_path}`} // URL изображения
                alt={title} // Альтернативный текст изображения
                className="movies-img active" // Класс для стилизации изображения
              />
              <div
                style={{
                  border: `2px solid ${this.getBorderColor(vote_average)}`,
                }}
                className="rating--circle"
              >
                {vote_average.toFixed(1)}
              </div>{" "}
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
