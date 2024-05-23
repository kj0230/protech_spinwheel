"use client";

import React, { Component } from "react";
import styles from "./selectedDrawDialog.module.scss";
import Image from "next/image";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Button } from "@mui/material";

class SelectedDrawDialog extends Component {
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
                <p>中奖啦</p>
              </div>
              <div className={styles.body}>
                <div className={styles.text}>
                  <p>你已赢取</p>
                  <p className={styles.prize}>{this.props.selectedPrize}</p>
                </div>

                <button
                  className={styles.prizeHistory}
                  onClick={this.props.onHistoryCallback}
                >
                  中奖记录
                </button>
              </div>
            </div>
            <div className={styles.closeWrapper}>
              <div className={styles.btn} onClick={this.props.onCloseCallback}>
                <CancelOutlinedIcon style={{ fill: "#FFFFFF" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SelectedDrawDialog;
