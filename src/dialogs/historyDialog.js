"use client";

import React, { Component } from "react";
import styles from "./historyDialog.module.scss";
import Image from "next/image";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Button } from "@mui/material";
import BasicButtons from "@/components/BasicButtons";

class HistoryDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { selectedPrizesHistory } = this.props;
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
                <p>中奖记录</p>
              </div>
              <div className={styles.body}>
                <div className={styles.tableWrapper}>
                  <table className={styles.tableWrapper}>
                    <thead>
                      <tr>
                        <th>礼物</th>
                        <th>时间</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPrizesHistory.map((item, index) => (
                        <tr key={index}>
                          <td>{item.prize}</td>
                          <td>{item.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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

export default HistoryDialog;
