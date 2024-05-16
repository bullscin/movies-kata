import React, { Component } from "react";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import "./MovieSearch.css";

export default class MovieSearch extends Component {
  constructor(props) {
    super(props);
    // Инициализация состояния компонента
    this.state = {
      querySearch: "", // Строка запроса
    };

    // Используем debounce для обработчика изменения ввода
    this.debouncedHandleSearchInputChange = debounce(
      this.handleSearchInputChange,
      1500,
    );
  }

  // Функция обработчика изменения запроса с задержкой
  handleSearchInputChange(query) {
    const { onQueryChange } = this.props;
    // Вызываем метод переданный через props для изменения запроса
    onQueryChange(query);
  }

  // Обработчик изменения ввода с задержкой
  onChangeInput(event) {
    const { value } = event.target;
    // Обновляем состояние компонента
    this.setState({
      querySearch: value,
    });
    // Вызываем обернутую в debounce функцию обработчика изменения ввода
    this.debouncedHandleSearchInputChange(value);
  }

  render() {
    const { querySearch } = this.state;
    return (
      <header className="header">
        <input
          className="movie-search"
          placeholder="Type to search..."
          value={querySearch}
          onChange={(event) => this.onChangeInput(event)}
        />
      </header>
    );
  }
}

MovieSearch.propTypes = {
  onQueryChange: PropTypes.func.isRequired,
};
