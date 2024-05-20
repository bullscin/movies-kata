import React from "react";
import PropTypes from "prop-types";
import { Pagination } from "antd"; // Импорт компонента Pagination из Ant Design
import Movie from "../MovieCard/MovieCard";
import "./MovieList.css";

export default function MovieList({
  movies,
  currentPage,
  totalPages,
  onPageChange,
  onRatingChange,
}) {
  // Проверка наличия фильмов
  if (movies.length === 0) {
    return <p>No movies found.</p>; // Вывод сообщения, если фильмы не найдены
  }

  return (
    <div>
      {/* Список фильмов */}
      <ul className="movies movies-list">
        {/* Маппинг массива фильмов для создания компонента Movie для каждого элемента */}
        {movies.map((movie) => (
          <Movie key={movie.id} movie={movie} onRatingChange={onRatingChange} /> // Компонент Movie для каждого фильма
        ))}
      </ul>
      {/* Компонент пагинации */}
      <Pagination
        className="pagination" // Класс для стилизации
        current={currentPage} // Текущая страница
        total={totalPages * 10} // Общее количество элементов
        onChange={onPageChange} // Обработчик изменения страницы
      />
    </div>
  );
}

// Проверка типов для props компонента MovieList
MovieList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired, // Идентификатор фильма
      title: PropTypes.string.isRequired, // Название фильма
      release_date: PropTypes.string.isRequired, // Дата выпуска фильма
      overview: PropTypes.string.isRequired, // Описание фильма
      poster_path: PropTypes.string, // Путь к постеру фильма
    }),
  ).isRequired, // Массив объектов фильмов

  currentPage: PropTypes.number.isRequired, // Текущая страница пагинации
  totalPages: PropTypes.number.isRequired, // Общее количество страниц
  onPageChange: PropTypes.func.isRequired, // Обработчик изменения страницы
  onRatingChange: PropTypes.func.isRequired, // Обработчик изменения рейтинга фильма
};
