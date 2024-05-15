/* eslint-disable no-console */
import React, { Component } from "react";
import { Pagination } from "antd";
import MovieService from "../MovieService/MovieService";
import MovieList from "../MovieList/MovieList";
import Spin from "../Spin/Spin";
import Alert from "../Alert/Alert";
import MovieSearch from "../MovieSearch/MovieSearch";
import RatedMovies from "../RatedMovies/RatedMovies";
import "../default-style/default-style.css";

export default class MovieApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      loading: true,
      error: false,
      isOnline: navigator.onLine,
      query: "",
      searchPerformed: false,
      currentPage: 1,
      totalPages: 0,
      currentTab: "search",
      ratedMovies: [],
    };
    this.setMovies = this.setMovies.bind(this);
    this.setError = this.setError.bind(this);
    this.handleOnline = this.handleOnline.bind(this);
    this.handleOffline = this.handleOffline.bind(this);
    this.handleSearchQueryChange = this.handleSearchQueryChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.switchTab = this.switchTab.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.setRatedMovies = this.setRatedMovies.bind(this);

    // Создаем экземпляр MovieService
    this.movieService = new MovieService({
      setMovies: this.setMovies,
      setError: this.setError,
    });
  }

  componentDidMount() {
    window.addEventListener("online", this.handleOnline);
    window.addEventListener("offline", this.handleOffline);
    // Вызываем метод createGuestSession при монтировании компонента
    this.movieService.createGuestSession();
  }

  componentWillUnmount() {
    window.removeEventListener("online", this.handleOnline);
    window.removeEventListener("offline", this.handleOffline);
  }

  handleOnline() {
    this.setState({ isOnline: true });
  }

  handleOffline() {
    this.setState({ isOnline: false });
  }

  handleTabClick(tab) {
    this.setState({ currentTab: tab });
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
    this.setState({ movies, totalPages, loading: false, error: false });
  }

  setRatedMovies(ratedMovies) {
    this.setState({ ratedMovies });
  }

  setError(error) {
    this.setState({ error, loading: false });
  }

  switchTab(tab) {
    this.setState({ currentTab: tab });
  }

  render() {
    const {
      movies,
      loading,
      error,
      isOnline,
      query,
      searchPerformed,
      currentPage,
      totalPages,
      currentTab,

      ratedMovies,
    } = this.state;

    let content;
    if (!isOnline) {
      content = (
        <Alert
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "17px",
          }}
          type="error"
          description=""
          message="Отсутствует подключение к интернету."
        />
      );
    } else if (currentTab === "search") {
      content = (
        <>
          <MovieSearch onQueryChange={this.handleSearchQueryChange} />
          {error && (
            <Alert
              type="error"
              message="Упс, что-то пошло не так!"
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
            <>
              <MovieList
                movies={movies}
                onRateChange={this.movieService.addRated}
              />
              <Pagination
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "17px",
                  marginTop: "36px",
                }}
                defaultCurrent={currentPage}
                total={totalPages}
                pageSize={10}
                onChange={this.handlePageChange}
              />
            </>
          )}
        </>
      );
    } else {
      content = <RatedMovies ratedMovies={ratedMovies} />;
    }

    return (
      <div className="container">
        <div className="wrapper-tabs">
          <button
            type="button"
            className={currentTab === "search" ? "tab active" : "tabs"}
            onClick={() => this.handleTabClick("search")}
          >
            Search
          </button>
          <button
            type="button"
            className={currentTab === "rated" ? "tab active" : "tabs"}
            onClick={() => this.handleTabClick("rated")}
          >
            Rated
          </button>
        </div>
        {content}
      </div>
    );
  }
}
