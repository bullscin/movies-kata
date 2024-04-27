/* eslint-disable no-console */
import React, { Component } from "react";
import MovieList from "../FilmList/FilmList";

export default class MovieSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
    };
  }

  componentDidMount() {
    this.fetchMovies();
  }

  async fetchMovies() {
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/search/movie?query=return&include_adult=false&language=en-US&page=1",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: "Bearer YOUR_API_KEY",
          },
        },
      );
      const data = await response.json();
      console.log(data);
      this.setState({ movies: data.results });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { movies } = this.state;
    return (
      <div className="container">
        <MovieList movies={movies} />
      </div>
    );
  }
}
