import React from "react";
import PropTypes from "prop-types";
import Movie from "../Movie/Movie";
import "./MovieList.css";

// Компонент для отображения списка фильмов
export default function MovieList({ movies, onRateChange }) {
  // Добавляем проверку на undefined перед вызовом метода map
  if (!movies) {
    return <p>Нет данных о фильмах</p>;
  }

  return (
    // Список фильмов
    <ul className="movies movies-list">
      {/* Маппинг массива фильмов для создания компонента Movie для каждого элемента */}
      {movies.map((movie) => (
        <Movie key={movie.id} movie={movie} onRateChange={onRateChange} /> // Компонент Movie для каждого фильма
      ))}
    </ul>
  );
}

// Определение типов ожидаемых свойств для MovieList
MovieList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired, // ID фильма (обязательное число)
      // Другие свойства фильма
    }),
  ).isRequired, // Массив объектов фильмов (обязательный)
  onRateChange: PropTypes.func.isRequired,
};
