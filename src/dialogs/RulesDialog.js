"use client";

import React, { Component } from "react";
import styles from "./RulesDialog.module.scss";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Button, TextField } from "@mui/material";

class RulesDialog extends Component {
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
                <p>抽奖规则</p>
              </div>
              <div className={styles.body}>
                <p>{`1) 登入后，点击“GO”来开始旋转转盘`}</p>
                <p>{`2) 抽奖后，可以点击中奖记录显示`}</p>
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

export default RulesDialog;
