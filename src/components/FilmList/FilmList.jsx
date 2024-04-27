import React from "react";
import PropTypes from "prop-types";
import Movie from "../Film/Film";

function MovieList({ movies }) {
  return (
    <ul className="films films-list">
      {movies.map((movie) => (
        <Movie key={movie.id} movie={movie} />
      ))}
    </ul>
  );
}

MovieList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      // Другие свойства фильма
    }),
  ).isRequired,
};

export default MovieList;
