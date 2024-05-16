// SearchTab.jsx
import React, { Component } from "react";
import MovieService from "../MovieService/MovieService";
import MovieSearch from "../MovieSearch/MovieSearch";
import MovieList from "../MovieList/MovieList";
import Spin from "../Spin/Spin";
import Alert from "../Alert/Alert";

export default class SearchTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      loading: false,
      error: null,
      query: "",
      searchPerformed: false,
      currentPage: 1,
      totalPages: 0,
    };
    this.handleSearchQueryChange = this.handleSearchQueryChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.setMovies = this.setMovies.bind(this);
    this.setError = this.setError.bind(this);
    this.movieService = new MovieService({
      setMovies: this.setMovies,
      setError: this.setError,
    });
  }

  handleSearchQueryChange(query) {
    this.setState({ query, loading: true, searchPerformed: true });
  }

  handlePageChange(page) {
    this.setState({ currentPage: page, loading: true }, () => {
      const { query, currentPage } = this.state;
      this.movieService.fetchMovies(query, currentPage);
    });
  }

  setMovies(movies, totalPages) {
    this.setState({ movies, totalPages, loading: false, error: null });
  }

  setError(error) {
    this.setState({ error, loading: false });
  }

  render() {
    const {
      movies,
      loading,
      error,
      searchPerformed,
      currentPage,
      totalPages,
      query,
    } = this.state;

    return (
      <div>
        <MovieSearch onQueryChange={this.handleSearchQueryChange} />
        {error && (
          <Alert
            type="error"
            message="Oops, something went wrong!"
            description={error.message}
          />
        )}
        {loading && <Spin />}
        <MovieService
          ref={(movieService) => {
            this.movieService = movieService;
          }}
          setMovies={this.setMovies}
          setError={this.setError}
          searchWord={query}
        />
        {searchPerformed && movies.length === 0 && !error && !loading && (
          <Alert description="" message="Результаты не найдены" type="info" />
        )}
        {!error && movies.length > 0 && (
          <MovieList
            movies={movies}
            loading={loading}
            searchPerformed={searchPerformed}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={this.handlePageChange}
          />
        )}
      </div>
    );
  }
}
