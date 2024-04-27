import React, { Component } from "react";
import MovieSearch from "../MovieSearch/MovieSearch";
import "../default-style/default-style.css";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <MovieSearch />
      </div>
    );
  }
}
