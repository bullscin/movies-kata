import React, { Component } from "react";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import "./MovieSearch.css";

export default class MovieSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      querySearch: "", // Строка запроса
    };

    // Используем debounce для обработчика изменения ввода с задержкой
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
        {/* Обертка для поисковой строки */}
        <input
          className="movie-search" // Класс для стилизации поисковой строки
          placeholder="Type to search..." // Плейсхолдер в поисковой строке
          value={querySearch} // Значение поискового запроса
          onChange={(event) => this.onChangeInput(event)} // Обработчик изменения ввода
        />
      </header>
    );
  }
}

MovieSearch.propTypes = {
  onQueryChange: PropTypes.func.isRequired,
};
