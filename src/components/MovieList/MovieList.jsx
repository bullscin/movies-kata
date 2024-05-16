// MovieList.jsx
import React from "react";
import PropTypes from "prop-types";
import { Pagination } from "antd";
import Movie from "../Movie/Movie";
import "./MovieList.css";

export default function MovieList({
  movies,
  searchPerformed,
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (!searchPerformed) {
    return <p>Please search for a movie.</p>;
  }

  if (movies.length === 0) {
    return <p>No movies found.</p>;
  }

  return (
    <div>
      <ul className="movies movies-list">
        {/* Маппинг массива фильмов для создания компонента Movie для каждого элемента */}
        {movies.map((movie) => (
          <Movie key={movie.id} movie={movie} /> // Компонент Movie для каждого фильма
        ))}
      </ul>
      <Pagination
        className="pagination"
        current={currentPage}
        total={totalPages * 10}
        onChange={onPageChange}
      />
    </div>
  );
}

MovieList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      release_date: PropTypes.string.isRequired,
      overview: PropTypes.string.isRequired,
      poster_path: PropTypes.string,
    }),
  ).isRequired,
  searchPerformed: PropTypes.bool.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
