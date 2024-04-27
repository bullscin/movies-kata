/* eslint-disable camelcase */
import React from "react";
import PropTypes from "prop-types";
import { format, isValid, parseISO } from "date-fns";

function Film({ movie }) {
  const { id, title, release_date, overview, poster_path } = movie;

  // Функция для сокращения текста описания
  function shortenDescription(description, maxLength) {
    if (description.length <= maxLength) {
      return description;
    }

    const words = description.split(" ");
    const shortenedText = words
      .reduce((result, word) => {
        if (result.length + word.length <= maxLength) {
          return `${result}${word} `;
        }
        return result;
      }, "")
      .trim();

    return `${shortenedText}...`;
  }

  // Проверка на пустую строку и форматирование даты
  const formattedDate =
    release_date && isValid(parseISO(release_date))
      ? format(parseISO(release_date), "yyyy-MM-dd")
      : "Invalid Date";

  //   const test = format(new Date(release_date), "MMMM dd, yyyy");
  return (
    <li key={id} className="films-item">
      <img
        src={`https://image.tmdb.org/t/p/original${poster_path}`}
        alt={title}
        className="films-img"
      />
      <div className="films-info">
        <h2 className="title">{title}</h2>
        <p className="date">{formattedDate}</p>
        <p className="description">{shortenDescription(overview, 150)}</p>
      </div>
    </li>
  );
}

Film.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    release_date: PropTypes.string.isRequired,
    overview: PropTypes.string.isRequired,
    poster_path: PropTypes.string,
  }).isRequired,
};

export default Film;
