"use client";

import React, { Component } from "react";
import styles from "./index.module.scss";
import ArrowPointer from "@/assets/small/arrowPointer.svg";
import Image from "next/image";
import SelectedDrawDialog from "@/dialogs/selectedDrawDialog";
import { PrizeList } from "@/configs/Language";
import { getCurrentTime } from "@/utilities/Default";
import BasicButtons from "@/components/BasicButtons";
import HistoryDialog from "@/dialogs/historyDialog";
import LoginDialog from "@/dialogs/loginDialog";
import RulesDialog from "@/dialogs/RulesDialog";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: "cn",
      prizeList: [
        "100元代金卷",
        "电动自行车",
        "谢谢参与",
        "山地自行车",
        "礼盒",
        "宝可梦",
      ],
      prizeProbability: [0.08, 0.05, 0.6, 0.05, 0.1, 0.12],
      angle: 0,
      canvasSize: 400,
      showSelectedPrizeDialog: false,
      selectedPrize: "",
      bgColor: [
        "#FF5733",
        "#FFC300",
        "#36FF33",
        "#336BFF",
        "#9B33FF",
        "#EF42F5",
      ],
      chancesLeft: 2,
      selectedPrizesHistory: [],
      showLoginDialog: true,
      showRulesDialog: false,
      loginStatus: false,
    };
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.setPrizeLanguage();
    this.renderWheel();

    this.checkLoginStatus();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.angle !== this.state.angle) {
      this.renderWheel();
    }
  }

  setPrizeLanguage = () => {
    let langEn = this.state.lang === "en";
    let langCn = this.state.lang === "cn";
    let prizeList = [];

    if (langEn) {
      PrizeList.forEach((item, index) => {
        let prizeEn = item.en;
        prizeList.push(prizeEn);
      });
    } else {
      PrizeList.forEach((item, index) => {
        let prizeCn = item.cn;
        prizeList.push(prizeCn);
      });
    }

    this.setState({ prizeList: prizeList }, () => {
      console.log(prizeList);
    });
  };

  renderWheel = () => {
    const { prizeList, angle } = this.state;
    const numberOptions = PrizeList.length;
    const anglePerSegment = (2 * Math.PI) / numberOptions;
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size to the device pixel ratio for crisp text
    const size = this.state.canvasSize; // Desired display size
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = size * devicePixelRatio;
    canvas.height = size * devicePixelRatio;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.scale(devicePixelRatio, devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Center the wheel
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2;

    // Rotate the entire canvas
    ctx.translate(centerX, centerY);
    ctx.rotate(angle); // Rotate by the angle state
    ctx.translate(-centerX, -centerY);

    prizeList.forEach((item, index) => {
      const startAngle = index * anglePerSegment;
      const endAngle = startAngle + anglePerSegment;

      // Draw the segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Alternate segment colors
      ctx.fillStyle = this.state.bgColor[index];
      ctx.fill();

      // Draw the segment lines
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw the text vertically
      const textAngle = startAngle + anglePerSegment / 2; // Calculate text angle for centering
      const x = centerX + radius * 0.8 * Math.cos(textAngle); // Adjust radius for text positioning
      const y = centerY + radius * 0.8 * Math.sin(textAngle); // Adjust radius for text positioning
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(textAngle + 2 * Math.PI); // Rotate text vertically in the opposite direction
      ctx.textAlign = "center";
      ctx.fillStyle = "#FFFFFF"; // Set text color to black
      ctx.font = "18px Arial";
      ctx.fillText(item, -38, 5);
      ctx.restore();
    });

    // Draw the center lines
    for (let i = 0; i < numberOptions; i++) {
      const angle = i * anglePerSegment;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + radius * Math.cos(angle),
        centerY + radius * Math.sin(angle)
      );
      ctx.strokeStyle = "#FFFFFF"; // Set line color to black
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  getColor() {
    // randomly generate rbg values for wheel sectors
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},0.4)`;
  }

  spin = () => {
    if (this.state.chancesLeft > 0) {
      const cumulativeProbabilities = this.state.prizeProbability.reduce(
        (acc, prob, index) => {
          if (index === 0) {
            acc.push(prob);
          } else {
            acc.push(prob + acc[index - 1]);
          }
          return acc;
        },
        []
      );

      const { prizeList, angle: currentAngle } = this.state;
      const numberOptions = prizeList.length;
      const anglePerSegment = (2 * Math.PI) / numberOptions;

      // Select the target index based on weighted probabilities
      const randomValue = Math.random();
      const targetIndex = cumulativeProbabilities.findIndex(
        (cumulativeProb) => randomValue < cumulativeProb
      );

      const targetAngle = targetIndex * anglePerSegment;

      // Number of spins
      const spins = 5;
      const finalAngle = spins * 2 * Math.PI + targetAngle;

      // Calculate the current angle offset
      const normalizedCurrentAngle = currentAngle % (2 * Math.PI);
      const finalAngleWithOffset = finalAngle - normalizedCurrentAngle;

      this.animateSpin(finalAngleWithOffset, targetIndex);
    } else {
      console.log("no more chances");
    }
  };

  animateSpin = (finalAngle) => {
    const duration = 3000; // Animation duration in ms
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const angle = progress * finalAngle;

      this.setState({ angle: angle });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.determinePrize();
      }
    };

    requestAnimationFrame(animate);
  };

  determinePrize = () => {
    const { angle, prizeList } = this.state;
    const numberOptions = prizeList.length;
    const anglePerSegment = (2 * Math.PI) / numberOptions;
    let currentTime = getCurrentTime();

    // Calculate the top center angle correctly
    let topCenterAngle = ((3 * Math.PI) / 2 - angle) % (2 * Math.PI);
    if (topCenterAngle < 0) topCenterAngle += 2 * Math.PI;

    // Determine the segment containing the top center angle
    const segmentIndex = Math.floor(topCenterAngle / anglePerSegment);
    const prize = prizeList[segmentIndex];

    console.log("Final angle:", angle);
    console.log("Top center angle:", topCenterAngle);
    console.log("Segment index:", segmentIndex);
    console.log("Prize:", prize);
    console.log("Current Time", currentTime);

    this.setState((prevState) => ({
      selectedPrize: prize,
      showSelectedPrizeDialog: !prevState.showSelectedPrizeDialog,
      chancesLeft: prevState.chancesLeft - 1,
      selectedPrizesHistory: [
        { prize: prize, time: currentTime },
        ...prevState.selectedPrizesHistory,
      ],
    }));
  };

  onLoginCallback = () => {
    this.setState({
      showLoginDialog: false,
      loginStatus: true,
    });
  };

  onSelectedPrizeDialogCallback = () => {
    this.setState({
      showSelectedPrizeDialog: !this.state.showSelectedPrizeDialog,
    });
  };

  onHistoryDialogCallback = () => {
    this.setState({
      showHistoryDialog: !this.state.showHistoryDialog,
    });
  };

  onRulesDialogCallback = () => {
    this.setState({
      showRulesDialog: !this.state.showRulesDialog,
    });
  };

  showHistoryDialog = () => {
    this.setState({
      showHistoryDialog: !this.state.showHistoryDialog,
    });
  };

  showRulesDialog = () => {
    this.setState({
      showRulesDialog: !this.state.showRulesDialog,
    });
  };

  checkLoginStatus = () => {
    if (this.state.loginStatus) {
      console.log("u have already logged in ");
    } else {
      console.log("Please Login now");
    }
  };

  render() {
    return (
      <div className={`${styles.pageWrapper} ${styles.body}`}>
        <div className={styles.pageContainer}>
          <div className={styles.title}>
            <p>
              幸运 <span>大转盘</span>
            </p>
          </div>

          <div
            className={styles.canvasWrapper}
            style={{ position: "relative" }}
          >
            <canvas
              ref={this.canvasRef}
              width={400}
              height={400}
              className={styles.spinWheel}
            />
            <div className={styles.spinBtnWrapper}>
              <button
                onClick={this.spin}
                className={
                  this.state.chancesLeft < 1 || !this.state.loginStatus
                    ? styles.hideBtn
                    : null
                }
                style={
                  this.state.showSelectedPrizeDialog
                    ? { pointerEvents: "none" }
                    : { pointerEvents: "all" }
                }
              >
                GO
              </button>
            </div>
            <div className={styles.arrowWrapper}>
              <Image
                src={ArrowPointer.src}
                width={24}
                height={24}
                className={styles.arrow}
                alt="arrowPointer"
              />
            </div>
          </div>

          <div className={styles.buttonsWrapper}>
            <div className={styles.chancesWrapper}>
              <p>
                你还有
                <span
                  style={
                    this.state.chancesLeft === 0
                      ? { color: "#ba0d07", fontSize: "18px" }
                      : {}
                  }
                >
                  {this.state.chancesLeft}
                </span>
                次机会
              </p>
            </div>
            <div className={styles.row}>
              <BasicButtons
                color={"#6b2c02"}
                background={"#fcc58d"}
                label={"抽奖规则"}
                onClick={this.showRulesDialog}
                opacity={!this.state.loginStatus && "50%"}
                pointerEvents={!this.state.loginStatus && "none"}
                userSelect={!this.state.loginStatus && "none"}
              />
              <BasicButtons
                background={"#de7804"}
                label={"中奖记录"}
                onClick={this.showHistoryDialog}
                opacity={this.state.chancesLeft === 2 && "50%"}
                pointerEvents={this.state.chancesLeft === 2 && "none"}
                userSelect={this.state.chancesLeft === 2 && "none"}
              />
            </div>
          </div>
        </div>
        <SelectedDrawDialog
          selectedPrize={this.state.selectedPrize}
          show={this.state.showSelectedPrizeDialog}
          onCloseCallback={this.onSelectedPrizeDialogCallback}
          onHistoryCallback={this.onHistoryDialogCallback}
        />

        <HistoryDialog
          show={this.state.showHistoryDialog}
          selectedPrizesHistory={this.state.selectedPrizesHistory}
          onCloseCallback={this.onHistoryDialogCallback}
        />

        <LoginDialog
          show={this.state.showLoginDialog}
          onCloseCallback={this.onLoginCallback}
        />

        <RulesDialog
          show={this.state.showRulesDialog}
          onCloseCallback={this.onRulesDialogCallback}
        />
      </div>
    );
  }
}

export default Home;
