import React, { Component } from "react";
import "rc-slider/assets/index.css";
import Slider, { SliderTooltip } from "rc-slider";
import ReactPlayer from "react-player";
import {
  Row,
  Col,
  Button,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Media,
  Input,
} from "reactstrap";
import axios from "axios";
import { nodeBaseURL } from "ApiURL";
import { NotifyWrapper } from "components/Alerts/Notify";
import { connect } from "react-redux";

import "./VideoPlayback.scss";
import Card from "reactstrap/lib/Card";

var qs = require("qs");
const mapStateToProps = (state) => {
  return {
    outlet: state.outletCode.outletCode,
  };
};

class BenchMarkTool extends Component {
  constructor(props) {
    super(props);
    this.player = React.createRef();
    this.state = {
      outletCode: props.outletCode,
      playing: false,
      currentTime: 0,
      status: "Not Playing",
      duration: 0,
      apiData: { "Loading...": {} },
      allowedFeatures: [
        "people_count",
        "male",
        "female",
        "no_mask",
        "no_hairnet",
        "no_gloves",
        "billing_counter_unmanned",
        "social_distancing_violated",
        "mopping",
        "customer_conversion_rate",
      ],
      manualData: { "Loading...": {} },
      percentageData: { "Loading...": {} },
      overallManualDataSum: 0,
      overallAIDataSum: 0,
      showDataForThisMinute: 1,
      moveButtons: {
        start: 0,
        end: 10,
      },
      hourList: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23,
      ],
      selectedHour: 10,
    };
    this._ismounted = true;
  }

  fetchData = (nextProps) => {
    var config = {
      method: "get",
      url: `${nodeBaseURL}benchmark/list/${nextProps.outletCode}/day/${nextProps.selectedHour}`,
      headers: {},
    };

    axios(config)
      .then((response) => {
        this._ismounted &&
          this.setState({
            apiData: response.data,
            manualData: response.data,
            selectedHour: nextProps.selectedHour,
          });

        console.log(response.data);
        let manualDataState = {};
        Object.values(this.state.apiData).map((item, index) => {
          manualDataState[index] = {};
          Object.keys(item).map((prop) => {
            manualDataState[index][prop] = 0;
          });
        });
        this.setState({
          manualData: manualDataState,
        });
      })
      .catch((error) => {
        console.log(error);
        NotifyWrapper.warning(
          "We are facing some error! Please contact us at support@nonagon.xyz."
        );
      });
  };

  postData = (feature, manual_count, accuracy, window) => {
    let data = qs.stringify({
      feature,
      manual_count,
      accuracy,
      window,
    });
    let config = {
      method: "post",
      url: `https://api.dev.nonagon.ai/benchmark/manual_data/${this.state.outletCode}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  postDataForThisMin = () => {
    let feature = "-";
    let manData = "-";
    let aiData = "-";
    let accuracy = "-";
    let window = "-";

    this.state.allowedFeatures.map((feat) => {
      feature = feat;
      manData = this.state.manualData[this.state.showDataForThisMinute][feat];
      aiData = this.state.apiData[this.state.showDataForThisMinute][feat];
      if (!isNaN(aiData / manData) && isFinite(aiData / manData)) {
        accuracy = ((aiData / manData) * 100).toFixed(0);
      } else {
        accuracy = 0;
      }
      window =
        "" +
        this.state.selectedHour.toString().padStart(2, 0) +
        ":" +
        (this.state.showDataForThisMinute - 1).toString().padStart(2, 0) +
        " to " +
        this.state.selectedHour.toString().padStart(2, 0) +
        ":" +
        this.state.showDataForThisMinute.toString().padStart(2, 0);

      this.postData(feature, manData, accuracy, window);
    });
  };

  componentDidMount() {
    this._ismounted && this.fetchData(this.state);
    console.log(this.setState.apiData);
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  getOverallPercentage() {
    let overallSum = 0;
    let indSum, aiData, manData, percent;
    this.state.allowedFeatures.map((feat) => {
      indSum = 0;
      for (let i = 0; i <= 60; i++) {
        if (this.state.apiData[i]) {
          aiData = this.state.apiData[i][feat];
          manData = this.state.manualData[i][feat];
          percent =
            manData != 0
              ? 100 - (Math.abs(aiData - manData) / manData) * 100
              : 0;

          indSum += !isNaN(percent) && isFinite(percent) ? percent : 0;
        }
      }
      overallSum += indSum;
    });
    return overallSum / (this.state.allowedFeatures.length * 60);
  }

  getOverallPercSum() {
    let sum = 0;
    Object.values(this.state.manualData).map((item) => {
      sum += Object.values(item).reduce((a, b) => a + b, 0);
    });

    return sum;
  }

  getOverallManualDataSum() {
    let sum = 0;
    Object.values(this.state.manualData).map((item) => {
      sum += Object.values(item).reduce((a, b) => a + b, 0);
    });

    return sum;
  }

  getOverallAIDataSum() {
    let sum = 0;
    Object.values(this.state.apiData).map((item) => {
      sum += Object.values(item).reduce((a, b) => a + b, 0);
    });

    return sum;
  }

  render() {
    var keys = this.state.apiData[this.state.showDataForThisMinute]
      ? Object.keys(
          this.state.apiData[this.state.showDataForThisMinute]
        ).filter((item) => {
          return this.state.allowedFeatures.includes(item);
        })
      : [];
    // var length = keys.length;

    const { createSliderWithTooltip } = Slider;
    const Range = createSliderWithTooltip(Slider.Range);
    const { Handle } = Slider;

    const handle = (props) => {
      const { value, dragging, index, ...restProps } = props;
      return (
        <SliderTooltip
          prefixCls="rc-slider-tooltip"
          overlay={`
          ${this.state.selectedHour.toString().padStart(2, 0)} : 
          ${value.toString().padStart(2, 0)}`}
          visible={dragging}
          placement="top"
          key={index}
        >
          <Handle value={value} {...restProps} />
        </SliderTooltip>
      );
    };

    return (
      <Card className="bnch-container">
        <Row>
          <Col md="7" className="video">
            <div className="player-wrapper">
              <ReactPlayer
                className="react-player"
                width="100%"
                height="100%"
                ref={this.player}
                control={true}
                url="https://nonagon-client-notification-video-archive.s3.ap-south-1.amazonaws.com/videos/vlc-record-2021-08-27-12h00m59s-rtmp___stream.nonagon.ai_show_TNDRC-MAATNIN001_live-.mp4"
                stopOnUnmount
                // light={true}
                playing={this.state.playing}
                onProgress={(obj) => {
                  this.setState({
                    currentTime: obj.playedSeconds,
                    showDataForThisMinute: Math.floor(obj.playedSeconds / 60),
                  });
                }}
                onPlay={() => {
                  this.setState({
                    playing: true,
                    status: "Playing",
                  });
                }}
                onDuration={(dur) =>
                  this._ismounted && this.setState({ duration: dur })
                }
                onBuffer={() => {
                  this.setState({
                    // playing: false,
                    status: "Buffering",
                  });
                }}
                onBufferEnd={() => {
                  this.setState({
                    playing: true,
                    status: "Playing",
                  });
                }}
              />
            </div>
          </Col>

          <Col md="5" className="details">
            <Row>
              <Col>
                <div className="title">Benchmarking Tool</div>
              </Col>
            </Row>
            <Row>
              <Col>
                <span className="h4 mr-3">Selected Timeframe:</span>
                <UncontrolledDropdown>
                  <DropdownToggle
                    style={{ paddingRight: "0" }}
                    color=""
                    tag="a"
                  >
                    <Media>
                      <Button size="sm">
                        Hour {this.state.selectedHour} to{" "}
                        {this.state.selectedHour + 1}
                        &nbsp;&nbsp;{" "}
                        <i className="fas fa-chevron-down text-primary"></i>
                      </Button>
                    </Media>
                  </DropdownToggle>
                  <DropdownMenu>
                    {this.state.hourList.map((item, index) => {
                      return (
                        <div key={index}>
                          <DropdownItem
                            onClick={(e) => {
                              e.preventDefault();
                              this._ismounted &&
                                this.setState({ selectedHour: item });
                              this._ismounted &&
                                this.fetchData({ selectedHour: item });
                            }}
                          >
                            <span>
                              Hour {item} to {item + 1}
                            </span>
                          </DropdownItem>
                        </div>
                      );
                    })}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Col>
            </Row>

            <Row className="mt-2 mx-1">
              <Col className="video-controls">
                <span
                  className="play-btn"
                  onClick={() => {
                    this.setState({
                      playing: !this.state.playing,
                    });
                  }}
                >
                  {this.state.playing ? (
                    <i className="fas fa-pause" />
                  ) : (
                    <i className="fas fa-play" />
                  )}
                </span>
                <span>
                  <span sm={2} className="text-muted">
                    {`
                            ${Math.floor(
                              Math.floor(this.state.currentTime) / 60
                            )
                              .toString()
                              .padStart(2, 0)} :
                                ${Math.floor(
                                  Math.floor(this.state.currentTime) % 60
                                )
                                  .toString()
                                  .padStart(2, 0)}
                        `}
                  </span>
                </span>
                <span>
                  <input
                    type="range"
                    className="custom-range"
                    id="videoSlider"
                    disabled
                    value={(this.state.currentTime / this.state.duration) * 100}
                  />
                </span>
                <span>
                  <span sm={2} className="text-muted">
                    {`
                            ${Math.floor(Math.floor(this.state.duration) / 60)
                              .toString()
                              .padStart(2, 0)} :
                            ${Math.floor(Math.floor(this.state.duration) % 60)
                              .toString()
                              .padStart(2, 0)}
                        `}
                  </span>
                </span>
              </Col>
            </Row>

            <Container className="skip-section">
              <Row>
                <Col sm={12}>
                  <div className="h4 mb-3">Skip to a specific minute</div>
                </Col>
                <Col sm={12} style={{ display: "flex", flexDirection: "row" }}>
                  <div style={{ width: "100%" }}>
                    <Slider
                      min={0}
                      max={60}
                      defaultValue={0}
                      handle={handle}
                      marks={{
                        0: "0",
                        10: "10",
                        20: "20",
                        30: "30",
                        40: "40",
                        50: "50",
                        60: "60",
                      }}
                      onAfterChange={(value) => {
                        this.player.current.seekTo(value * 60, "seconds");
                        console.log(
                          "fffffffff",
                          this.state.showDataForThisMinute
                        );
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
        <Row>
          <Col>
            <span className="video-sub">
              Currently showing AI inference from&nbsp;
              <span>
                {keys[0] === null
                  ? null
                  : `${this.state.selectedHour.toString().padStart(2, 0)}:${(
                      this.state.showDataForThisMinute - 1
                    )
                      .toString()
                      .padStart(2, 0)}
                          `}
              </span>{" "}
              to{" "}
              <span>
                {keys[0] === null
                  ? null
                  : `${this.state.selectedHour
                      .toString()
                      .padStart(2, 0)}:${this.state.showDataForThisMinute
                      .toString()
                      .padStart(2, 0)}
                          `}
              </span>
              of <span>8th Sep 2021</span>
            </span>
          </Col>
        </Row>
        <Row className="video-data">
          {this.state.apiData[this.state.showDataForThisMinute]
            ? keys.map((item, index) => {
                console.log(this.state.showDataForThisMinute);
                console.log(this.state.apiData);
                let aiData =
                  this.state.apiData[this.state.showDataForThisMinute][
                    item
                  ].toFixed(0);

                let manData =
                  this.state.manualData[
                    Math.floor(this.state.currentTime / 60)
                  ][item];

                return (
                  <Col key={index} sm={4}>
                    <Card className="bnch-card">
                      <div className="title">{item.split("_").join(" ")}</div>
                      <hr />
                      <Row>
                        <Col>
                          <div className="ai-data">
                            AI Observation: <br />
                            <div>{aiData}</div>
                          </div>
                        </Col>
                        <Col>
                          <div className="manual-data">
                            <label>Manual Observation </label>
                            <span>
                              <Input
                                type="number"
                                name={item}
                                className="manual-input"
                                placeholder="00"
                                value={manData}
                                onChange={(e) => {
                                  let typeValue = parseInt(e.target.value, 10);
                                  this.setState((prevState) => {
                                    let indx = Math.floor(
                                      this.state.currentTime / 60
                                    );
                                    prevState.manualData[indx][item] =
                                      typeValue;
                                    return prevState;
                                  });
                                }}
                              />
                            </span>
                          </div>
                        </Col>
                      </Row>
                      <hr />
                      <div className="ai-accuracy">
                        AI Accuracy: &nbsp;
                        <strong>
                          {!isNaN(Math.abs(aiData - manData) / manData) &&
                          isFinite(Math.abs(aiData - manData) / manData)
                            ? aiData > manData && manData != 0
                              ? (
                                  100 -
                                  (Math.abs(aiData - manData) / aiData) * 100
                                ).toFixed(2)
                              : (
                                  100 -
                                  (Math.abs(aiData - manData) / manData) * 100
                                ).toFixed(2)
                            : parseFloat(0).toFixed(2)}
                          %
                        </strong>
                      </div>
                    </Card>
                  </Col>
                );
              })
            : "Loading..."}
        </Row>
        <br />
        <Row>
          <Col>
            <Button
              className="submit-data-btn"
              onClick={() => {
                NotifyWrapper.success(
                  `Your data For the time ${this.state.selectedHour
                    .toString()
                    .padStart(2, 0)}:
                      ${(this.state.showDataForThisMinute - 1)
                        .toString()
                        .padStart(2, 0)}
                         to
                         ${this.state.selectedHour.toString().padStart(2, 0)}:
                        ${this.state.showDataForThisMinute
                          .toString()
                          .padStart(2, 0)} has been saved.`
                );
              }}
            >
              Submit Data For Current Minute
            </Button>
          </Col>
          <Col>
            <div className="overall-percent">
              Overall AI Accuracy: &nbsp;
              <span>{this.getOverallPercentage().toFixed(2)}%</span>
            </div>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default connect(mapStateToProps)(BenchMarkTool);
