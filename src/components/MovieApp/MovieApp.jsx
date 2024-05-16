import React, { Component } from "react";
import SearchTab from "../SearchTab/SearchTab"; // Импорт компонента SearchTab
import RatedTab from "../RatedTab/RatedTab"; // Импорт компонента RatedTab
import Alert from "../Alert/Alert"; // Импорт компонента Alert
import "../default-style/default-style.css"; // Импорт стилей

export default class MovieApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: "search", // Текущая вкладка по умолчанию - "search"
      isOnline: navigator.onLine, // Проверка на наличие подключения к интернету
    };
    this.switchTab = this.switchTab.bind(this); // Привязка контекста для switchTab
    this.handleOnline = this.handleOnline.bind(this); // Привязка контекста для handleOnline
    this.handleOffline = this.handleOffline.bind(this); // Привязка контекста для handleOffline
  }

  componentDidMount() {
    window.addEventListener("online", this.handleOnline); // Слушатель события online
    window.addEventListener("offline", this.handleOffline); // Слушатель события offline
  }

  componentWillUnmount() {
    window.removeEventListener("online", this.handleOnline); // Удаление слушателя события online
    window.removeEventListener("offline", this.handleOffline); // Удаление слушателя события offline
  }

  handleOnline() {
    this.setState({ isOnline: true }); // Обработчик события online - устанавливает состояние isOnline в true
  }

  handleOffline() {
    this.setState({ isOnline: false }); // Обработчик события offline - устанавливает состояние isOnline в false
  }

  switchTab(tab) {
    this.setState({ currentTab: tab }); // Функция для переключения вкладок
  }

  render() {
    const { currentTab, isOnline } = this.state; // Деструктуризация состояния

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
      content = currentTab === "search" ? <SearchTab /> : <RatedTab />; // В зависимости от текущей вкладки отображается соответствующий компонент
    }

    return (
      <div className="container">
        {" "}
        {/* Обертка для контента */}
        <div className="wrapper-tabs">
          {" "}
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
    );
  }
}
