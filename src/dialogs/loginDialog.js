"use client";

import React, { Component } from "react";
import styles from "./loginDialog.module.scss";
import Image from "next/image";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Button, TextField } from "@mui/material";

class LoginDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        className={`${styles.wrapper} ${this.props.show ? styles.show : null}`}
        style={{ pointerEvents: "none" }}
      >
        <div className={styles.backdrop}>
          <div
            className={`${styles.container} ${
              this.props.show ? styles.show : null
            }`}
          >
            <div className={styles.content}>
              <div className={styles.title}>
                <p>请登入</p>
              </div>
              <div className={styles.body}>
                <div className={styles.text}>
                  <TextField
                    required
                    id="outlined-required"
                    label="ID"
                    defaultValue="ABC123"
                  />
                  <TextField
                    required
                    id="outlined-required"
                    label="Password"
                    defaultValue="********"
                  />
                </div>

                <button
                  className={styles.prizeHistory}
                  onClick={this.props.onCloseCallback}
                >
                  登入
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginDialog;
