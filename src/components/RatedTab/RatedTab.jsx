import React, { Component } from "react";
import MovieList from "../MovieList/MovieList";

export default class RatedTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newratedMovies: [],
    };
  }

  componentDidMount() {
    this.updateRatedMoviesFromLocalStorage();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.updateRatedMoviesFromLocalStorage();
    }
  }

  updateRatedMoviesFromLocalStorage() {
    const ratedMoviesFromLocalStorage = JSON.parse(
      localStorage.getItem("ratedMovies"),
    );
    if (ratedMoviesFromLocalStorage) {
      this.setState({
        newratedMovies: [...ratedMoviesFromLocalStorage],
      });
    }
  }

  render() {
    const { newratedMovies } = this.state;
    return (
      <div>
        <MovieList
          movies={newratedMovies}
          searchPerformed={false}
          currentPage={1}
          totalPages={0}
          onPageChange={() => {}}
          onRatingChange={() => {}}
        />
      </div>
    );
  }
}
