// Alert.js
import React from "react";
import PropTypes from "prop-types";
import { Alert as AntdAlert } from "antd";

export default function Alert({ message, description, type }) {
  return <AntdAlert type={type} message={message} description={description} />;
}

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
