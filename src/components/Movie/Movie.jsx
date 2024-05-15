/* eslint-disable camelcase */ // Отключение проверки camelCase для этого файла
import React from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import Rate from "../Rate/Rate";
import "./Movie.css";

// Компонент для отображения информации о фильме
export default function Movie({ movie, onRateChange }) {
  // Деструктуризация свойств фильма
  const { id, title, release_date, overview, poster_path } = movie;

  // Функция для сокращения описания фильма
  function shortenDescription(description, maxLength = 150) {
    if (description.length <= maxLength) return description;

    const lastSpaceIndex = description.lastIndexOf(" ", maxLength);

    return `${description.slice(0, lastSpaceIndex)}...`;
  }

  // Форматирование даты выпуска фильма
  const formattedDate = release_date
    ? format(new Date(release_date), "yyyy-MM-dd")
    : "Invalid Date";

  const handleRateChange = (rating) => {
    onRateChange(id, rating); // Call the onRateChange function with movie id and rating
  };

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
        <p className="description">{shortenDescription(overview)}</p>
        <Rate className="rate" onChange={handleRateChange} />
      </div>
    </li>
  );
}

// Определение типов ожидаемых свойств для Movie
Movie.propTypes = {
  // Объект фильма с определенными свойствами
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired, // ID фильма (обязательное число)
    title: PropTypes.string.isRequired, // Название фильма (обязательная строка)
    release_date: PropTypes.string.isRequired, // Дата выпуска фильма (обязательная строка)
    overview: PropTypes.string.isRequired, // Описание фильма (обязательная строка)
    poster_path: PropTypes.string, // Путь к изображению фильма (необязательная строка)
  }).isRequired, // Обязательный объект фильма
  onRateChange: PropTypes.func.isRequired,
};
