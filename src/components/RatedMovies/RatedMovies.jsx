import React from "react";
import PropTypes from "prop-types";
import MovieList from "../MovieList/MovieList";

function RatedMovies({ ratedMovies }) {
  let content;

  if (!ratedMovies || ratedMovies.length === 0) {
    content = <p>Нет оцененных фильмов</p>;
  } else {
    content = (
      <MovieList
        movies={ratedMovies.map((movie) => ({
          ...movie,
          rating: movie.rating || 0, // Если рейтинг не задан, установить значение по умолчанию 0
        }))}
      />
    );
  }

  return (
    <div>
      <h2>Оцененные фильмы</h2>
      {content}
    </div>
  );
}

RatedMovies.propTypes = {
  ratedMovies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      release_date: PropTypes.string.isRequired,
      overview: PropTypes.string.isRequired,
      poster_path: PropTypes.string,
      rating: PropTypes.number, // Рейтинг фильма
    }),
  ).isRequired,
};

export default RatedMovies;
