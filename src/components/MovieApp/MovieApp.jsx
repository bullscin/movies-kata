import React, { Component } from "react";
import SearchTab from "../SearchTab/SearchTab";
import RatedTab from "../RatedTab/RatedTab";
import Alert from "../Alert/Alert";
import "../default-style/default-style.css";

export default class MovieApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: "search",
      isOnline: navigator.onLine,
    };
    this.switchTab = this.switchTab.bind(this);
    this.handleOnline = this.handleOnline.bind(this);
    this.handleOffline = this.handleOffline.bind(this);
  }

  componentDidMount() {
    window.addEventListener("online", this.handleOnline);
    window.addEventListener("offline", this.handleOffline);
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

  switchTab(tab) {
    this.setState({ currentTab: tab });
  }

  render() {
    const { currentTab, isOnline } = this.state;

    let content;
    if (!isOnline) {
      content = (
        <Alert
          className="alert"
          type="error"
          description=""
          message="Отсутствует подключение к интернету."
        />
      );
    } else {
      content = currentTab === "search" ? <SearchTab /> : <RatedTab />;
    }

    return (
      <div className="container">
        <div className="wrapper-tabs">
          <button
            type="button"
            className={currentTab === "search" ? "tab active" : "tab"}
            onClick={() => this.switchTab("search")}
          >
            Search
          </button>
          <button
            type="button"
            className={currentTab === "rated" ? "tab active" : "tab"}
            onClick={() => this.switchTab("rated")}
          >
            Rated
          </button>
        </div>
        {content}
      </div>
    );
  }
}
