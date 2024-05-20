/* eslint-disable no-console */ // Отключение eslint для console.log

import React, { Component, createContext } from "react"; // Импорт React и createContext из библиотеки React
import Service from "../Service/Service"; // Импорт класса Service из файла Service.js
import SearchTab from "../SearchTab/SearchTab"; // Импорт компонента SearchTab из файла SearchTab.js
import RatedTab from "../RatedTab/RatedTab"; // Импорт компонента RatedTab из файла RatedTab.js
import Alert from "../Alert/Alert"; // Импорт компонента Alert из файла Alert.js
import "../default-style/default-style.css"; // Импорт файла стилей default-style.css
import "./MovieApp.css"; // Импорт файла стилей default-style.css

export const Context = createContext([]); // Создание контекста с пустым массивом по умолчанию

export default class MovieApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: "search", // Текущая вкладка по умолчанию - "search"
      isOnline: navigator.onLine, // Проверка на наличие подключения к интернету
      genresList: [], // Список жанров
    };
    this.switchTab = this.switchTab.bind(this); // Привязка контекста для метода switchTab
    this.handleOnline = this.handleOnline.bind(this); // Привязка контекста для метода handleOnline
    this.handleOffline = this.handleOffline.bind(this); // Привязка контекста для метода handleOffline

    this.service = new Service(); // Создание экземпляра класса Service
  }

  async componentDidMount() {
    window.addEventListener("online", this.handleOnline); // Добавление слушателя события online
    window.addEventListener("offline", this.handleOffline); // Добавление слушателя события offline

    const genres = await this.service.getGenres(); // Получение списка жанров с помощью сервиса
    this.setState({ genresList: genres }); // Установка списка жанров в состояние
  }

  componentWillUnmount() {
    window.removeEventListener("online", this.handleOnline); // Удаление слушателя события online
    window.removeEventListener("offline", this.handleOffline); // Удаление слушателя события offline
  }

  // Метод для обработки события online
  handleOnline() {
    this.setState({ isOnline: true }); // Установка состояния isOnline в true
  }

  // Метод для обработки события offline
  handleOffline() {
    this.setState({ isOnline: false }); // Установка состояния isOnline в false
  }

  // Метод для переключения вкладок
  switchTab(tab) {
    this.setState({ currentTab: tab }); // Установка текущей вкладки
  }

  render() {
    const { currentTab, isOnline, genresList } = this.state; // Деструктуризация состояния

    let content;
    if (!isOnline) {
      // Если нет интернет-подключения
      content = (
        <Alert
          className="alert"
          type="error"
          description=""
          message="Отсутствует подключение к интернету."
        />
      );
    } else {
      // Если есть подключение к интернету
      content = currentTab === "search" ? <SearchTab /> : <RatedTab />; // Отображение соответствующей вкладки в зависимости от текущей вкладки
    }

    // console.log(genresList); // Вывод списка жанров в консоль

    return (
      <Context.Provider value={genresList}>
        {/* Предоставление значения контекста для дочерних компонентов */}
        <div className="container">
          {" "}
          {/* Обертка для контента */}
          <div className="wrapper-tabs">
            {/* Обертка для вкладок */}
            <button
              type="button"
              className={currentTab === "search" ? "tab active" : "tab"} // Установка активного класса для вкладки "Search"
              onClick={() => this.switchTab("search")} // Обработчик клика для переключения на вкладку "Search"
            >
              Search
            </button>
            <button
              type="button"
              className={currentTab === "rated" ? "tab active" : "tab"} // Установка активного класса для вкладки "Rated"
              onClick={() => this.switchTab("rated")} // Обработчик клика для переключения на вкладку "Rated"
            >
              Rated
            </button>
          </div>
          {content} {/* Вывод контента в зависимости от состояния */}
        </div>
      </Context.Provider>
    );
  }
}
