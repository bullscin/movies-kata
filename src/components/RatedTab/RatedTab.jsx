import React, { Component } from "react";
// import PropTypes from "prop-types";
import MovieList from "../MovieList/MovieList";

export default class RatedTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ratedMovies: [],
    };
  }

  render() {
    const { ratedMovies } = this.state;
    return (
      <div>
        <MovieList movies={ratedMovies} />
      </div>
    );
  }
}

// RatedTab.propTypes = {
//
// };
