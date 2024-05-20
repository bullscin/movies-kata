/* eslint-disable class-methods-use-this */
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
    this.state = {
      isMobile: window.innerWidth <= 420,
    };
    this.updateDimensions = this.updateDimensions.bind(this);
    this.shortenDescription = this.shortenDescription.bind(this);
    this.handleRatingChange = this.handleRatingChange.bind(this);
    this.getBorderColor = this.getBorderColor.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

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

  updateDimensions() {
    this.setState({ isMobile: window.innerWidth <= 420 });
  }

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

    const { isMobile } = this.state;

    return (
      <Context.Consumer>
        {(genresList) =>
          !isMobile ? (
            <li className="movies-item">
              <img
                src={`https://image.tmdb.org/t/p/original${poster_path}`} // URL изображения
                alt={title} // Альтернативный текст изображения
                className="movies-img " // Класс для стилизации изображения
              />
              <div className="movies-info">
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
                    const genre = genresList.genres.find(
                      (g) => g.id === genreId,
                    ); // Поиск соответствующего жанра по идентификатору
                    return (
                      genre && ( // Если жанр существует
                        <button className="text" type="button" key={genreId}>
                          {genre.name} {/* Название жанра */}
                        </button>
                      )
                    );
                  })}
                </div>
                <p className="description">
                  {this.shortenDescription(overview)}
                </p>{" "}
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
          ) : (
            <li className="movies-item">
              <div className="movies-info ">
                <div className="movies-top">
                  <img
                    src={`https://image.tmdb.org/t/p/original${poster_path}`} // URL изображения
                    alt={title}
                    className="movies-img "
                  />
                  <div
                    style={{
                      border: `2px solid ${this.getBorderColor(vote_average)}`,
                    }}
                    className="rating--circle"
                  >
                    {vote_average.toFixed(1)}
                  </div>
                  <div>
                    <h2 className="title">{title}</h2>
                    <p className="date">{formattedDate}</p>
                    <div className="genre">
                      {genre_ids.map((genreId) => {
                        const genre = genresList.genres.find(
                          (g) => g.id === genreId,
                        );
                        return (
                          genre && (
                            <button
                              className="text"
                              type="button"
                              key={genreId}
                            >
                              {genre.name}
                            </button>
                          )
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="movies-bottom">
                  <p className="description">
                    {this.shortenDescription(overview)}
                  </p>{" "}
                  <Rate
                    count={10}
                    allowHalf
                    value={rating}
                    className="rate"
                    onChange={this.handleRatingChange}
                  />
                </div>
              </div>
            </li>
          )
        }
      </Context.Consumer>
    );
  }
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    overview: PropTypes.string.isRequired,
  }).isRequired,
  onRatingChange: PropTypes.func.isRequired,
  newratedMovies: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    overview: PropTypes.string.isRequired,
    release_date: PropTypes.string.isRequired,
    poster_path: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    genre_ids: PropTypes.arrayOf(PropTypes.number).isRequired,
    vote_average: PropTypes.number.isRequired,
  }),
};

MovieCard.defaultProps = {
  newratedMovies: null,
};
