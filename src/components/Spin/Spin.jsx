import React from "react";
import { Spin } from "antd";
import "./Spin.css";

export default function App() {
  return (
    <div className="spin-container">
      <Spin size="large" />
    </div>
  );
}
