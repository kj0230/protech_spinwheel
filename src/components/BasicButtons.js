"use client";

import React, { Component } from "react";
import styles from "./BasicButtons.module.scss";

class BasicButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        className={styles.btnWrapper}
        style={{
          color: this.props.color ?? "#FFFFFF",
          background: this.props.background ?? "#d64161",
          pointerEvents: this.props.pointerEvents ?? "all",
          opacity: this.props.opacity ?? 1,
          userSelect: this.props.userSelect ?? "auto",
        }}
        onClick={this.props.onClick ?? "auto"}
      >
        {this.props.label}
      </div>
    );
  }
}
export default BasicButtons;
